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
exports.doctorServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const doctor_model_1 = require("./doctor.model");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const doctor_constant_1 = require("./doctor.constant");
const aggregateQuryBuilder_1 = require("../../utils/aggregateQuryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const booking_model_1 = require("../booking/booking.model");
const booking_interface_1 = require("../booking/booking.interface");
const generateSlots_1 = require("../../utils/generateSlots");
const addSpecialize = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSpecialize = yield doctor_model_1.Specialization.findOne({ name: payload.name.toLowerCase() });
    if (existingSpecialize) {
        throw new AppError_1.default(http_status_codes_2.default.BAD_REQUEST, "doctor specialization already exists.");
    }
    yield doctor_model_1.Specialization.create({ name: payload.name.toLowerCase() });
});
const updateSpecialize = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isSpecializeExist = yield doctor_model_1.Specialization.findById(id);
    if (!isSpecializeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "specialize not found!");
    }
    const updateSpecialize = yield doctor_model_1.Specialization.findByIdAndUpdate(id, payload, { new: true });
    return updateSpecialize;
});
const getAllSpecialize = () => __awaiter(void 0, void 0, void 0, function* () {
    const allSpecialize = yield doctor_model_1.Specialization.find({});
    return allSpecialize;
});
const addDoctor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(payload.user);
    const isSpecializeExist = yield doctor_model_1.Specialization.findById(payload.specialization);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    if (!isSpecializeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "specialize not found!");
    }
    if (isUserExist.role == user_interface_1.Role.DOCTOR) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user already a doctor");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const doctor = (yield (yield doctor_model_1.Doctor.create(payload)).populate("user")).populate("specialization");
        yield user_model_1.User.findByIdAndUpdate(payload.user, { role: user_interface_1.Role.DOCTOR, permitToDoctor: user_interface_1.DoctorRequest.APPROVED });
        yield session.commitTransaction();
        session.endSession();
        return doctor;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Doctor update failed");
    }
});
const rejectRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is deleted!");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is not verified!");
    }
    if (isUserExist.permitToDoctor != user_interface_1.DoctorRequest.PENDING) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Request can only be rejected when pending!");
    }
    isUserExist.permitToDoctor = user_interface_1.DoctorRequest.REJECTED;
    yield isUserExist.save();
});
const updateDoctor = (doctorId, decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDoctor = yield doctor_model_1.Doctor.findById(doctorId);
    if (!existingDoctor) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Doctor not found.");
    }
    const ifUserExist = yield user_model_1.User.findById(existingDoctor.user);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    // Authorization checks
    if (decodedToken.role === user_interface_1.Role.DOCTOR) {
        if (existingDoctor.user.toString() !== decodedToken.userId) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized");
        }
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        ifUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized");
    }
    if (payload.role && decodedToken.role === user_interface_1.Role.DOCTOR) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    if ((payload.isDeleted || payload.isVerified) && decodedToken.role === user_interface_1.Role.DOCTOR) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    // Separate user & doctor data
    const userInfo = ["name", "phone", "gender", "address", "picture", "isDeleted", "isVerified", "role"];
    const doctorInfo = [
        "specialization", "licenceNumber", "availableTimes",
        "degree", "experience", "fees", "about"
    ];
    const updateUser = {};
    const updateDoctorData = {};
    for (const key of Object.keys(payload)) {
        if (userInfo.includes(key)) {
            updateUser[key] = payload[key];
        }
        else if (doctorInfo.includes(key)) {
            updateDoctorData[key] = payload[key];
        }
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (Object.keys(updateUser).length) {
            yield user_model_1.User.findByIdAndUpdate(existingDoctor.user, { $set: updateUser }, { new: true, runValidators: true, session });
        }
        const updatedDoctor = yield doctor_model_1.Doctor.findByIdAndUpdate(doctorId, { $set: updateDoctorData }, { new: true, runValidators: true, session }).populate("user specialization").exec(); // ✅ populate
        yield session.commitTransaction();
        session.endSession();
        if (ifUserExist === null || ifUserExist === void 0 ? void 0 : ifUserExist.picture) {
            yield (0, cloudinary_config_1.deleteImageFromCloudinary)(ifUserExist.picture);
        }
        return updatedDoctor;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Doctor update failed");
    }
});
const getAllDoctors = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const aggBuilder = new aggregateQuryBuilder_1.AggregationQueryBuilder(query);
    const pipeline = aggBuilder
        .lookup("user", "users") // 'user' field from 'users' collection
        .lookup("specialization", "specializations") // same for specialization
        .filter()
        .search(doctor_constant_1.doctorSearChQueryFields) // searching nested fields
        .sort()
        .fields()
        .paginate()
        .build();
    const data = yield doctor_model_1.Doctor.aggregate(pipeline);
    const meta = yield aggBuilder.getMeta(doctor_model_1.Doctor);
    return {
        data,
        meta,
    };
});
const getSingleDoctor = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    const findDoctor = yield doctor_model_1.Doctor.findById(doctorId).populate("user");
    if (!findDoctor) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor not found");
    }
    const isUserExist = yield user_model_1.User.findById(findDoctor.user);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "doctor user info not found");
    }
    return findDoctor;
});
const getAvailableSlots = (doctorId, date) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(doctorId);
    if (!doctor)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Doctor not found");
    if (!date)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "date not found");
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[new Date(date).getDay()];
    // doctor-এর ওই দিনের availability বের করা
    const availability = doctor === null || doctor === void 0 ? void 0 : doctor.availableTimes.find((slot) => slot.day === dayOfWeek);
    if (!availability)
        return [];
    // slot generate করা
    let slots = (0, generateSlots_1.generateSlots)(availability.startTime, availability.endTime, availability.slotDuration);
    // already booked slot বের করা
    const bookedSlots = yield booking_model_1.Booking.find({ doctor: doctorId, bookingDate: date, status: booking_interface_1.BOOKING_STATUS.COMPLETE });
    // available slot filter করা
    slots = slots.filter((slot) => !bookedSlots.some((b) => b.startTime === slot.startTime && b.endTime === slot.endTime));
    return slots;
});
exports.doctorServices = {
    addDoctor,
    addSpecialize,
    updateSpecialize,
    getAllSpecialize,
    updateDoctor,
    rejectRequest,
    getAllDoctors,
    getSingleDoctor,
    getAvailableSlots
};
