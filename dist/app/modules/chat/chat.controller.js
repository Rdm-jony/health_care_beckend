import { catchAsync } from "../../utils/catchAsync.js";
import { chatService } from "./chat.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatusCode from "http-status-codes";
const conversation = catchAsync(async (req, res) => {
    const { message, threadId } = req.body;
    const data = await chatService.conversation(message, threadId);
    sendResponse(res, {
        data: data,
        message: "Bookings successfull.please check your email",
        statusCode: httpStatusCode.OK,
        success: true
    });
});
export const chatController = { conversation };
