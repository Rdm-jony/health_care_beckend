import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { paymentServices } from "./payment.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCode from "http-status-codes"

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId
    const result = await paymentServices.initPayment(bookingId)

    sendResponse(res, {
        data: result.paymentURL,
        success: true,
        message: "payment initiate successfully",
        statusCode: httpStatusCode.CREATED
    })
})


export const paymentController = { initPayment }