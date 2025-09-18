import { userService } from "./user.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatusCode from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
const createUser = catchAsync(async (req, res) => {
    const payload = {
        ...req.body,
        picture: req?.file?.path
    };
    const user = await userService.createUser(payload);
    sendResponse(res, {
        data: user,
        message: "user create successfully",
        statusCode: httpStatusCode.CREATED,
        success: true
    });
});
const getAllUser = catchAsync(async (req, res) => {
    const query = req.query;
    const user = await userService.getAllUser(query);
    sendResponse(res, {
        data: user.data,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        meta: user?.meta,
        success: true
    });
});
const updateUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const decodedToken = req.user;
    const payload = {
        ...req.body,
        picture: req?.file?.path
    };
    const user = await userService.updateUser(userId, payload, decodedToken);
    sendResponse(res, {
        data: user,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const getSingleUser = catchAsync(async (req, res) => {
    const userId = req.params.id;
    const user = await userService.getSingleUser(userId);
    sendResponse(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const getMe = catchAsync(async (req, res) => {
    const decodedToken = req.user;
    const user = await userService.getMe(decodedToken.userId);
    sendResponse(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
const sendDoctorRequest = catchAsync(async (req, res) => {
    const decodedToken = req.user;
    await userService.sendDoctorRequest(decodedToken.userId);
    sendResponse(res, {
        data: null,
        message: "Request sent",
        statusCode: httpStatusCode.OK,
        success: true,
    });
});
const getAllPendingRequest = catchAsync(async (req, res) => {
    const query = req.query;
    const allPendingReq = await userService.getAllPendingRequest(query);
    sendResponse(res, {
        data: allPendingReq.data,
        message: "Request sent",
        statusCode: httpStatusCode.OK,
        success: true,
        meta: { ...allPendingReq.meta, total: allPendingReq?.data.length }
    });
});
export const userController = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
    sendDoctorRequest,
    getAllPendingRequest
};
