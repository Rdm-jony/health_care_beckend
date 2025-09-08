/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Doctor } from "../doctor/doctor.model";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatusCode from "http-status-codes"
import { Booking } from "./booking.model";
import { Payment } from "../payement/payment.model";
import { IUser, Role } from "../user/user.interface";
import { AggregationQueryBuilder } from "../../utils/aggregateQuryBuilder";
import { bookingDoctorSearchField, bookingUserSearchField } from "./booking.constant";
import { generateInvoiceBuffer, IInvoice } from "../../utils/invoice";
import { ISpecialization } from "../doctor/doctor.interface";
import { sendMail } from "../../utils/sendMail";

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

const getUserBookings = async (userId: string, query: Record<string, string>) => {
    const aggBuilder = new AggregationQueryBuilder(query);

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        ...aggBuilder
            .lookup("doctor", "doctors")
            .lookup("doctor.user", "users")
            .filter()
            .search(bookingDoctorSearchField)
            .sort()
            .fields()
            .paginate()
            .build(),
    ];
    const data = await Booking.aggregate(pipeline);
    const meta = await aggBuilder.getMeta(Doctor);

    return {
        data,
        meta,
    };


}
const getAllDoctorBookings = async (userId: string, query: Record<string, string>) => {
    const aggBuilder = new AggregationQueryBuilder(query);

    const pipeline = aggBuilder
        .lookup("user", "users")
        .filter()
        .search(bookingUserSearchField) // searching nested fields
        .sort()
        .fields()
        .paginate()
        .build();
    const data = await Booking.aggregate(pipeline);
    const meta = await aggBuilder.getMeta(Doctor);

    return {
        data,
        meta,
    };


}

const cashBooking = async (bookingId: string) => {
    const findBooking = await Booking.findById(bookingId)
    if (!findBooking) {
        throw new AppError(httpStatusCode.NOT_FOUND, "booking not found")
    }
    if (findBooking.status !== BOOKING_STATUS.PENDING) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "this route working on pending booking")
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        findBooking.status = BOOKING_STATUS.CASH
        findBooking.payment = null
        await findBooking.save({ session })
        await Payment.findOneAndDelete({ booking: bookingId }, { session })
        const user = await User.findById(findBooking.user)
        if (!user) {
            throw new AppError(httpStatusCode.NOT_FOUND, "user not found")
        }
        const doctor = await Doctor.findById(findBooking.doctor).populate("user").populate("specialization")
        if (!doctor) {
            throw new AppError(httpStatusCode.NOT_FOUND, "doctor not found")
        }
        const invoiceData: IInvoice = {
            customerEmail: user?.email,
            customerName: user.name,
            date: findBooking.bookingDate,
            startTime: findBooking.startTime,
            endTime: findBooking.endTime,
            total: doctor?.fees,
            specialization: (doctor.specialization as unknown as ISpecialization).name,
            paymentType: "Cash",
            doctorName: (doctor.user as unknown as IUser).name,
            transactionId: null // Add this line


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
        return
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }


}

export const bookingService = {
    createBooking,
    getUserBookings,
    getAllDoctorBookings,
    cashBooking
}