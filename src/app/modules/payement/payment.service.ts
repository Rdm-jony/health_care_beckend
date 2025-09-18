/* eslint-disable @typescript-eslint/no-explicit-any */
import { Payment } from "./payment.model.js"
import AppError from "../../errorHelpers/AppError.js"
import httpStatusCode from "http-status-codes"
import { Booking } from "../booking/booking.model.js"
import { ISSLCommerz } from "../sslCommerze/sslCommerze.interface.js"
import { SSLService } from "../sslCommerze/sslCommerze.service.js"
import { IUser } from "../user/user.interface.js"
import mongoose from "mongoose"
import { PAYMENT_STATUS } from "./payment.interface.js"
import { BOOKING_STATUS } from "../booking/booking.interface.js"
import { User } from "../user/user.model.js"
import { Doctor } from "../doctor/doctor.model.js"
import { generateInvoiceBuffer, IInvoice } from "../../utils/invoice.js"
import { ISpecialization } from "../doctor/doctor.interface.js"
import { sendMail } from "../../utils/sendMail.js"


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
const successPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID
        }, { new: true, session })

        const updatedBooking = await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.COMPLETE
        }, { new: true, session })

        if (!updatedBooking) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "booking not update")
        }

        const user = await User.findById(updatedBooking.user)

        if (!user) {
            throw new AppError(httpStatusCode.NOT_FOUND, "user not found")
        }

        const doctor = await Doctor.findById(updatedBooking.doctor).populate("user").populate("specialization")
        if (!doctor) {
            throw new AppError(httpStatusCode.NOT_FOUND, "doctor not found")
        }
        const invoiceData: IInvoice = {
            customerEmail: user?.email,
            customerName: user.name,
            date: updatedBooking.bookingDate,
            startTime: updatedBooking.startTime,
            endTime: updatedBooking.endTime,
            total: doctor?.fees,
            specialization: (doctor.specialization as unknown as ISpecialization).name,
            paymentType: "Online",
            doctorName: (doctor.user as unknown as IUser).name,
            transactionId: updatedPayment?.transactionId // Add this line


        }
        const pdfBuffer = await generateInvoiceBuffer(invoiceData)
        await sendMail({
            subject: "Download your booking invoice",
            templateData: invoiceData as unknown as Record<string, string>,
            templateName: "invoice",
            to: user.email,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })
        await session.commitTransaction()
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }

}
const cancelPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELLED
        }, { session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.CANCEL
        }, { session })
        await session.commitTransaction()
        session.endSession()
        return { success: false, message: "Payment cancelled" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }

}
const failPayment = async (query: Record<string, string>) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED
        }, { session })

        await Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: BOOKING_STATUS.FAILED
        }, { session })
        await session.commitTransaction()
        session.endSession()
        return { success: false, message: "Payment failed" }
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }

}

export const paymentServices = {
    initPayment,
    successPayment,
    cancelPayment,
    failPayment
}