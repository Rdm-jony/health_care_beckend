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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const payment_model_1 = require("./payment.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("../booking/booking.model");
const sslCommerze_service_1 = require("../sslCommerze/sslCommerze.service");
const mongoose_1 = __importDefault(require("mongoose"));
const payment_interface_1 = require("./payment.interface");
const booking_interface_1 = require("../booking/booking.interface");
const user_model_1 = require("../user/user.model");
const doctor_model_1 = require("../doctor/doctor.model");
const invoice_1 = require("../../utils/invoice");
const sendMail_1 = require("../../utils/sendMail");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment Not Found. You have not booked this tour");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking).populate("user");
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhoneNumber = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    if (!userAddress) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user address not provide.update your profile");
    }
    if (!userPhoneNumber) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user phone number not provide.update your profile");
    }
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
    const response = yield sslCommerze_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentURL: response.GatewayPageURL
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID
        }, { new: true, session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.COMPLETE
        }, { new: true, session });
        if (!updatedBooking) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "booking not update");
        }
        const user = yield user_model_1.User.findById(updatedBooking.user);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
        }
        const doctor = yield doctor_model_1.Doctor.findById(updatedBooking.doctor).populate("user").populate("specialization");
        if (!doctor) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor not found");
        }
        const invoiceData = {
            customerEmail: user === null || user === void 0 ? void 0 : user.email,
            customerName: user.name,
            date: updatedBooking.bookingDate,
            startTime: updatedBooking.startTime,
            endTime: updatedBooking.endTime,
            total: doctor === null || doctor === void 0 ? void 0 : doctor.fees,
            specialization: doctor.specialization.name,
            paymentType: "Online",
            doctorName: doctor.user.name,
            transactionId: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.transactionId // Add this line
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
        return { success: true, message: "Payment Completed Successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELLED
        }, { session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.CANCEL
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment cancelled" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED
        }, { session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.FAILED
        }, { session });
        yield session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment failed" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.paymentServices = {
    initPayment,
    successPayment,
    cancelPayment,
    failPayment
};
