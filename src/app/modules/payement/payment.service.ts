/* eslint-disable @typescript-eslint/no-explicit-any */
import { Payment } from "./payment.model"
import AppError from "../../errorHelpers/AppError"
import httpStatusCode from "http-status-codes"
import { Booking } from "../booking/booking.model"
import { ISSLCommerz } from "../sslCommerze/sslCommerze.interface"
import { SSLService } from "../sslCommerze/sslCommerze.service"
import { IUser } from "../user/user.interface"


const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }
    const booking = await Booking.findById(payment.booking).populate("user")
    const userAddress = (booking?.user as unknown as IUser).address
    const userEmail = (booking?.user as unknown as IUser).email
    const userPhoneNumber = (booking?.user as unknown as IUser).phone
    const userName = (booking?.user as unknown as IUser).name
    if (!userAddress) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user address not provide.update your profile")

    }
    if (!userPhoneNumber) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user phone number not provide.update your profile")

    }
    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }
    const response = await SSLService.sslPaymentInit(sslPayload)
    return {
        paymentURL: response.GatewayPageURL
    }
}


export const paymentServices = {
    initPayment
}