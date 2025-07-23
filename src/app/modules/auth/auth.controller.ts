/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import { IUser } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { createUsersToken } from "../../utils/createUsersToken";
import { authService } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: Partial<IUser>) => {
        if (err) {
            return next(new AppError(httpStatusCode.BAD_REQUEST, err))
        }
        if (!user) {
            return next(new AppError(httpStatusCode.BAD_REQUEST, "Invalid credentials."))

        }
        const authTokens = createUsersToken(user)
        setAuthCookie(res, authTokens)
        sendResponse(res, {
            data: user,
            message: "user logged in successfully!",
            success: true,
            statusCode: httpStatusCode.CREATED
        })
    })(req, res, next)

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "No refresh token recieved from cookies")

    }

    const newAccessToken = await authService.getNewAccessToken(refreshToken)
    setAuthCookie(res, newAccessToken)
    sendResponse(res, {
        data: newAccessToken,
        message: "New Access Token Retrived Successfully",
        success: true,
        statusCode: httpStatusCode.OK
    })
})

export const authController = { credentialsLogin, getNewAccessToken }