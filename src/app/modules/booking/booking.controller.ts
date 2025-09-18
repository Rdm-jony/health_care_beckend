import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync.js"
import { bookingService } from "./booking.service.js"
import { JwtPayload } from "jsonwebtoken"
import httpStatusCode from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse.js"

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

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req?.user as JwtPayload
    const query = req.query as Record<string, string>
    const bookings = await bookingService.getUserBookings(decodedToken.userId, query)

    sendResponse(res, {
        data: bookings.data,
        message: "users Bookings successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const getAllDoctorBookings = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req?.user as JwtPayload
    const query = req.query as Record<string, string>
    const bookings = await bookingService.getAllDoctorBookings(decodedToken.userId, query)

    sendResponse(res, {
        data: bookings.data,
        message: "doctor Bookings retrive successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const cashBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id
    await bookingService.cashBooking(bookingId)

    sendResponse(res, {
        data: null,
        message: "Bookings successfull.please check your email",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

export const bookingController = {
    createBooking,
    getUserBookings,
    getAllDoctorBookings,
    cashBooking
}