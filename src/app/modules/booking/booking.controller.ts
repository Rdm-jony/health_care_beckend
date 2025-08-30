import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { bookingService } from "./booking.service"
import { JwtPayload } from "jsonwebtoken"
import httpStatusCode from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse"

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req?.user as JwtPayload
    const payload = req.body
    await bookingService.createBooking(decodedToken.userId, payload)

    sendResponse(res, {
        data: null,
        message: "Booking a slot successfully",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})

export const bookingController = {
    createBooking
}