import { catchAsync } from "../../utils/catchAsync.js";
import { doctorServices } from "./doctor.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatusCode from "http-status-codes";
const addSpecialize = catchAsync(async (req, res) => {
    const payload = {
        image: req?.file?.path,
        ...req.body
    };
    const newSpecialize = await doctorServices.addSpecialize(payload);
    sendResponse(res, {
        data: newSpecialize,
        message: "doctor specializaion create succesfully!",
        statusCode: httpStatusCode.CREATED,
        success: true
    });
});
const updateSpecialize = catchAsync(async (req, res) => {
    const id = req.params.id;
    const payload = {
        image: req?.file?.path,
        ...req.body
    };
    const updatedSpecialization = await doctorServices.updateSpecialize(id, payload);
    sendResponse(res, {
        data: updatedSpecialization,
        message: "specializaion update succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const getAllSpecialize = catchAsync(async (req, res) => {
    const allSpecialize = await doctorServices.getAllSpecialize();
    sendResponse(res, {
        data: allSpecialize,
        message: "allSpecialize retrived succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const addDoctor = catchAsync(async (req, res) => {
    const newDoctor = await doctorServices.addDoctor(req.body);
    sendResponse(res, {
        data: newDoctor,
        message: "doctor create succesfully!",
        statusCode: httpStatusCode.CREATED,
        success: true
    });
});
const rejectRequest = catchAsync(async (req, res) => {
    const userId = req.params.id;
    await doctorServices.rejectRequest(userId);
    sendResponse(res, {
        data: null,
        message: "permit To doctor reject!",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const getAllDoctors = catchAsync(async (req, res) => {
    const query = req.query;
    const allDoctors = await doctorServices.getAllDoctors(query);
    sendResponse(res, {
        data: allDoctors.data,
        message: "all doctor retrieved succesfully!",
        statusCode: httpStatusCode.OK,
        success: true,
        meta: allDoctors.meta
    });
});
const getSingleDoctor = catchAsync(async (req, res) => {
    const id = req.params.id;
    const doctor = await doctorServices.getSingleDoctor(id);
    sendResponse(res, {
        data: doctor,
        message: "single doctor retrieved succesfully!",
        statusCode: httpStatusCode.OK,
        success: true,
    });
});
const updateDoctor = catchAsync(async (req, res) => {
    const doctorId = req.params.id;
    const decodedToken = req.user;
    const payload = {
        picture: req?.file?.path,
        ...req.body
    };
    const updatedDoctor = await doctorServices.updateDoctor(doctorId, decodedToken, payload);
    sendResponse(res, {
        data: updatedDoctor,
        message: "doctor update succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const getAvailableSlots = catchAsync(async (req, res) => {
    const doctorId = req.params.id;
    const date = req.query.date;
    const slots = await doctorServices.getAvailableSlots(doctorId, date);
    sendResponse(res, {
        data: slots,
        message: "doctor slot retrive succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
export const doctorControllers = {
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
