"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const doctor_model_1 = require("../doctor/doctor.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payement/payment.model");
const user_interface_1 = require("../user/user.interface");
const aggregateQuryBuilder_1 = require("../../utils/aggregateQuryBuilder");
const booking_constant_1 = require("./booking.constant");
const invoice_1 = require("../../utils/invoice");
const sendMail_1 = require("../../utils/sendMail");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.random() * 1000}`;
};
const createBooking = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if ((user === null || user === void 0 ? void 0 : user.role) !== user_interface_1.Role.USER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only a patient can book slot");
    }
    if (!(user === null || user === void 0 ? void 0 : user.phone)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "phone number is required. Update your profile");
    }
    if (!(user === null || user === void 0 ? void 0 : user.address)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "phone number is required. Update your profile");
    }
    const findDoctor = yield doctor_model_1.Doctor.findById(payload.doctor);
    if (!findDoctor) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor not found");
    }
    if (!findDoctor.fees) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor fees not found");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const newBooking = yield booking_model_1.Booking.create([Object.assign(Object.assign({}, payload), { user: userId })], { session });
        const newPayment = yield payment_model_1.Payment.create([Object.assign(Object.assign({}, payload), { amount: findDoctor.fees, transactionId: getTransactionId(), booking: newBooking[0]._id })], { session });
        yield booking_model_1.Booking.findByIdAndUpdate(newBooking[0]._id, {
            payment: newPayment[0]._id
        }, {
            new: true,
            runValidators: true,
            session
        });
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getUserBookings = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const aggBuilder = new aggregateQuryBuilder_1.AggregationQueryBuilder(query);
    const pipeline = [
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        ...aggBuilder
            .lookup("doctor", "doctors")
            .lookup("doctor.user", "users")
            .filter()
            .search(booking_constant_1.bookingDoctorSearchField)
            .sort()
            .fields()
            .paginate()
            .build(),
    ];
    const data = yield booking_model_1.Booking.aggregate(pipeline);
    const meta = yield aggBuilder.getMeta(doctor_model_1.Doctor);
    return {
        data,
        meta,
    };
});
const getAllDoctorBookings = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const aggBuilder = new aggregateQuryBuilder_1.AggregationQueryBuilder(query);
    const pipeline = aggBuilder
        .lookup("user", "users")
        .filter()
        .search(booking_constant_1.bookingUserSearchField) // searching nested fields
        .sort()
        .fields()
        .paginate()
        .build();
    const data = yield booking_model_1.Booking.aggregate(pipeline);
    const meta = yield aggBuilder.getMeta(doctor_model_1.Doctor);
    return {
        data,
        meta,
    };
});
const cashBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const findBooking = yield booking_model_1.Booking.findById(bookingId);
    if (!findBooking) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "booking not found");
    }
    if (findBooking.status !== booking_interface_1.BOOKING_STATUS.PENDING) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "this route working on pending booking");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        findBooking.status = booking_interface_1.BOOKING_STATUS.CASH;
        findBooking.payment = null;
        yield findBooking.save({ session });
        yield payment_model_1.Payment.findOneAndDelete({ booking: bookingId }, { session });
        const user = yield user_model_1.User.findById(findBooking.user);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
        }
        const doctor = yield doctor_model_1.Doctor.findById(findBooking.doctor).populate("user").populate("specialization");
        if (!doctor) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor not found");
        }
        const invoiceData = {
            customerEmail: user === null || user === void 0 ? void 0 : user.email,
            customerName: user.name,
            date: findBooking.bookingDate,
            startTime: findBooking.startTime,
            endTime: findBooking.endTime,
            total: doctor === null || doctor === void 0 ? void 0 : doctor.fees,
            specialization: doctor.specialization.name,
            paymentType: "Cash",
            doctorName: doctor.user.name,
            transactionId: null // Add this line
        };
        const pdfBuffer = yield (0, invoice_1.generateInvoiceBuffer)(invoiceData);
        yield (0, sendMail_1.sendMail)({
            subject: "Download your booking invoice",
            templateData: invoiceData,
            templateName: "invoice",
            to: user.email,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });
        yield session.commitTransaction();
        session.endSession();
        return;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.bookingService = {
    createBooking,
    getUserBookings,
    getAllDoctorBookings,
    cashBooking
};
