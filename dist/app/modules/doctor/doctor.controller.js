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
exports.doctorControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const doctor_service_1 = require("./doctor.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const addSpecialize = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign({ image: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path }, req.body);
    const newSpecialize = yield doctor_service_1.doctorServices.addSpecialize(payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: newSpecialize,
        message: "doctor specializaion create succesfully!",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
}));
const updateSpecialize = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const payload = Object.assign({ image: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path }, req.body);
    const updatedSpecialization = yield doctor_service_1.doctorServices.updateSpecialize(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: updatedSpecialization,
        message: "specializaion update succesfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getAllSpecialize = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allSpecialize = yield doctor_service_1.doctorServices.getAllSpecialize();
    (0, sendResponse_1.sendResponse)(res, {
        data: allSpecialize,
        message: "allSpecialize retrived succesfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const addDoctor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newDoctor = yield doctor_service_1.doctorServices.addDoctor(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: newDoctor,
        message: "doctor create succesfully!",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
}));
const rejectRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    yield doctor_service_1.doctorServices.rejectRequest(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: null,
        message: "permit To doctor reject!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getAllDoctors = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const allDoctors = yield doctor_service_1.doctorServices.getAllDoctors(query);
    (0, sendResponse_1.sendResponse)(res, {
        data: allDoctors.data,
        message: "all doctor retrieved succesfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true,
        meta: allDoctors.meta
    });
}));
const getSingleDoctor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const doctor = yield doctor_service_1.doctorServices.getSingleDoctor(id);
    (0, sendResponse_1.sendResponse)(res, {
        data: doctor,
        message: "single doctor retrieved succesfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const updateDoctor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doctorId = req.params.id;
    const decodedToken = req.user;
    const payload = Object.assign({ picture: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path }, req.body);
    const updatedDoctor = yield doctor_service_1.doctorServices.updateDoctor(doctorId, decodedToken, payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: updatedDoctor,
        message: "doctor update succesfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getAvailableSlots = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorId = req.params.id;
    const date = req.query.date;
    const slots = yield doctor_service_1.doctorServices.getAvailableSlots(doctorId, date);
    (0, sendResponse_1.sendResponse)(res, {
        data: slots,
        message: "doctor slot retrive succesfully!",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
exports.doctorControllers = {
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
