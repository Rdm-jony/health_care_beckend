import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body)
        sendResponse(res, {
            data: user,
            message: "user create successfully",
            statusCode: httpStatusCode.CREATED,
            success: true
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    createUser
}