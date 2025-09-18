import { catchAsync } from "../../utils/catchAsync.js";
import { otpSrvice } from "./otp.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatusCode from "http-status-codes";
const sendOtp = catchAsync(async (req, res) => {
    await otpSrvice.sendOtp(req.body);
    sendResponse(res, {
        data: null,
        message: "otp sent your email",
        success: true,
        statusCode: httpStatusCode.OK
    });
});
const verifyOtp = catchAsync(async (req, res) => {
    await otpSrvice.verifyOtp(req.body);
    sendResponse(res, {
        data: null,
        message: "verify email successfully",
        success: true,
        statusCode: httpStatusCode.OK
    });
});
export const otpController = {
    sendOtp,
    verifyOtp
};
