import { envVars } from "../config/env.js";
import httpStatusCode from "http-status-codes";
import { generateToken, verifyToken } from "./jwt.js";
import { User } from "../modules/user/user.model.js";
import AppError from "../errorHelpers/AppError.js";
export const createUsersToken = (user) => {
    const accessToken = generateToken({ name: user.email, role: user.role, userId: user?._id }, envVars.JWT_ACCESS_TOKEN_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRESIN);
    const refreshToken = generateToken({ name: user.email, role: user.role, userId: user?._id }, envVars.JWT_REFRESH_TOKEN_SECRET, envVars.JWT_REFRESH_TOKEN_EXPIRESIN);
    return {
        accessToken,
        refreshToken
    };
};
export const generateNewAccessTokenByRefreshToken = async (refreshToken) => {
    const decodedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN_SECRET);
    const isUserExist = await User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User does not exist");
    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified");
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRESIN);
    return accessToken;
};
