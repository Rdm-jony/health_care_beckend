import AppError from "../../errorHelpers/AppError.js";
import { User } from "../user/user.model.js";
import httpStatusCode from "http-status-codes";
import { redisClient } from "../../config/redis.config.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { sendMail } from "../../utils/sendMail.js";
const otpExpireTime = 2 * 60;
const sendOtp = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found!");
    }
    if (user.isVerified) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "user already verified!");
    }
    const otpKey = `otp:${user.email}`;
    const otp = generateOtp();
    await redisClient.set(otpKey, otp, {
        expiration: {
            type: "EX",
            value: otpExpireTime
        }
    });
    await sendMail({
        to: user.email,
        subject: "Your Otp Code",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp: otp
        }
    });
};
const verifyOtp = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found!");
    }
    if (user.isVerified) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "user already verified!");
    }
    const otpKey = `otp:${user.email}`;
    const savedOtp = await redisClient.get(otpKey);
    if (payload.otp !== savedOtp) {
        throw new AppError(401, "Invalid OTP");
    }
    await Promise.all([
        User.updateOne({ email: payload.email }, { isVerified: true }),
        redisClient.del([otpKey])
    ]);
};
export const otpSrvice = {
    sendOtp,
    verifyOtp
};
