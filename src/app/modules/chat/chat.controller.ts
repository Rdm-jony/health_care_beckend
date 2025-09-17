import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { chatService } from "./chat.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCode from "http-status-codes"

const conversation = catchAsync(async (req: Request, res: Response) => {
    const { message, threadId } = req.body
    const data = await chatService.conversation(message, threadId)

    sendResponse(res, {
        data: data,
        message: "Bookings successfull.please check your email",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
export const chatController = { conversation }