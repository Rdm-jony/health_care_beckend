import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatusCode from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync.js";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface.js";



const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload: Partial<IUser> = {
        ...req.body,
        picture: req?.file?.path
    }
    const user = await userService.createUser(payload)
    sendResponse(res, {
        data: user,
        message: "user create successfully",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const query=req.query as Record<string,string>
    const user = await userService.getAllUser(query)
    sendResponse(res, {
        data: user.data,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        meta:user?.meta,
        success: true
    })
})
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const decodedToken = req.user as JwtPayload
    const payload: Partial<IUser> = {
        ...req.body,
        picture: req?.file?.path
    }
    const user = await userService.updateUser(userId, payload, decodedToken)
    sendResponse(res, {
        data: user,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await userService.getSingleUser(userId)
    sendResponse(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const user = await userService.getMe(decodedToken.userId)
    sendResponse(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const sendDoctorRequest = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    await userService.sendDoctorRequest(decodedToken.userId)
    sendResponse(res, {
        data: null,
        message: "Request sent",
        statusCode: httpStatusCode.OK,
        success: true,
    })
})
const getAllPendingRequest = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const allPendingReq = await userService.getAllPendingRequest(query)
    sendResponse(res, {
        data: allPendingReq.data,
        message: "Request sent",
        statusCode: httpStatusCode.OK,
        success: true,
        meta: {...allPendingReq.meta,total:allPendingReq?.data.length}
    })
})



export const userController = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
    sendDoctorRequest,
    getAllPendingRequest
}