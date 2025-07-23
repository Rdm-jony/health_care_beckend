import { Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";



const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body)
    sendResponse(res, {
        data: user,
        message: "user create successfully",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getAllUser()
    sendResponse(res, {
        data: user,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})



export const userController = {
    createUser,
    getAllUser
}