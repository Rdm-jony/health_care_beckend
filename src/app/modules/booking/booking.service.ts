/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Doctor } from "../doctor/doctor.model";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatusCode from "http-status-codes"
import { Booking } from "./booking.model";
import { Payment } from "../payement/payment.model";
import { Role } from "../user/user.interface";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.random() * 1000}`
}
const createBooking = async (userId: string, payload: Partial<IBooking>) => {
    const user = await User.findById(userId)
    if (user?.role !== Role.USER) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Only a patient can book slot")

    }
    if (!user?.phone) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "phone number is required. Update your profile")
    }
    if (!user?.address) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "phone number is required. Update your profile")
    }

    const findDoctor = await Doctor.findById(payload.doctor)
    if (!findDoctor) {
        throw new AppError(httpStatusCode.NOT_FOUND, "doctor not found")
    }
    if (!findDoctor.fees) {
        throw new AppError(httpStatusCode.NOT_FOUND, "doctor fees not found")
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newBooking = await Booking.create([{ ...payload, user: userId, }], { session })
        const newPayment = await Payment.create([{ ...payload, amount: findDoctor.fees, transactionId: getTransactionId(), booking: newBooking[0]._id }], { session })
        await Booking.findByIdAndUpdate(newBooking[0]._id, {
            payment: newPayment[0]._id
        }, {
            new: true,
            runValidators: true,
            session
        })
        await session.commitTransaction()
        session.endSession()
    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

export const bookingService = {
    createBooking
}