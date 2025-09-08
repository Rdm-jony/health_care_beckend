import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { paymentServices } from "./payment.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatusCode from "http-status-codes"
import { envVars } from "../../config/env"

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
const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await paymentServices.successPayment(query)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await paymentServices.cancelPayment(query)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})
const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await paymentServices.failPayment(query)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
})

export const paymentController = { initPayment,successPayment,cancelPayment,failPayment }