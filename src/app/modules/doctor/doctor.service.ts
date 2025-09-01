/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { DoctorRequest, IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IDoctor, ISpecialization } from "./doctor.interface";
import httpStatusCode from "http-status-codes"
import { Doctor, Specialization } from "./doctor.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import httpStausCode from "http-status-codes"
import { doctorSearChQueryFields } from "./doctor.constant";
import { AggregationQueryBuilder } from "../../utils/aggregateQuryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { Booking } from "../booking/booking.model";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { generateSlots } from "../../utils/generateSlots";

const addSpecialize = async (payload: ISpecialization) => {
    const existingSpecialize = await Specialization.findOne({ name: payload.name.toLowerCase() });

    if (existingSpecialize) {
        throw new AppError(httpStausCode.BAD_REQUEST, "doctor specialization already exists.");
    }

    await Specialization.create({ name: payload.name.toLowerCase() });
}

const updateSpecialize = async (id: string, payload: ISpecialization) => {
    const isSpecializeExist = await Specialization.findById(id)
    if (!isSpecializeExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "specialize not found!")
    }
    const updateSpecialize = await Specialization.findByIdAndUpdate(id, payload, { new: true });
    return updateSpecialize;
}

const getAllSpecialize = async () => {
    const allSpecialize = await Specialization.find({})
    return allSpecialize
}
const addDoctor = async (payload: IDoctor) => {
    const isUserExist = await User.findById(payload.user)
    const isSpecializeExist = await Specialization.findById(payload.specialization)
    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found!")
    }
    if (!isSpecializeExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "specialize not found!")
    }
    if (isUserExist.role == Role.DOCTOR) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user already a doctor")

    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const doctor = (await (await Doctor.create(payload)).populate("user")).populate("specialization")
        await User.findByIdAndUpdate(payload.user, { role: Role.DOCTOR, permitToDoctor: DoctorRequest.APPROVED })
        await session.commitTransaction();
        session.endSession();
        return doctor
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError(httpStatusCode.BAD_REQUEST, "Doctor update failed");
    }


}

const rejectRequest = async (userId: string) => {
    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found!")
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "user is deleted!")

    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "user is not verified!")

    }

    if (isUserExist.permitToDoctor != DoctorRequest.PENDING) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Request can only be rejected when pending!")

    }
    isUserExist.permitToDoctor = DoctorRequest.REJECTED
    await isUserExist.save()
}

const updateDoctor = async (
    doctorId: string,
    decodedToken: JwtPayload,
    payload: Partial<IDoctor> & Partial<IUser>
) => {
    const existingDoctor = await Doctor.findById(doctorId);
    if (!existingDoctor) {
        throw new AppError(httpStatusCode.NOT_FOUND, "Doctor not found.");
    }

    const ifUserExist = await User.findById(existingDoctor.user);
    if (!ifUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found");
    }

    // Authorization checks
    if (decodedToken.role === Role.DOCTOR) {
        if (existingDoctor.user.toString() !== decodedToken.userId) {
            throw new AppError(httpStatusCode.UNAUTHORIZED, "You are not authorized");
        }
    }

    if (
        decodedToken.role === Role.ADMIN &&
        ifUserExist.role === Role.SUPER_ADMIN
    ) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, "You are not authorized");
    }

    if (payload.role && decodedToken.role === Role.DOCTOR) {
        throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
    }

    if ((payload.isDeleted || payload.isVerified) && decodedToken.role === Role.DOCTOR) {
        throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
    }

    // Separate user & doctor data
    const userInfo = ["name", "phone", "gender", "address", "picture", "isDeleted", "isVerified", "role"];
    const doctorInfo = [
        "specialization", "licenceNumber", "availableTimes",
        "degree", "experience", "fees", "about"
    ];

    const updateUser: Partial<IUser> = {};
    const updateDoctorData: Partial<IDoctor> = {};

    for (const key of Object.keys(payload)) {
        if (userInfo.includes(key)) {
            updateUser[key as keyof IUser] = payload[key as keyof typeof payload] as any;
        } else if (doctorInfo.includes(key)) {
            updateDoctorData[key as keyof IDoctor] = payload[key as keyof typeof payload] as any;
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (Object.keys(updateUser).length) {
            await User.findByIdAndUpdate(
                existingDoctor.user,
                { $set: updateUser },
                { new: true, runValidators: true, session }
            );
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { $set: updateDoctorData },
            { new: true, runValidators: true, session }
        ).populate("user specialization").exec(); // ✅ populate

        await session.commitTransaction();
        session.endSession();
        if (ifUserExist?.picture) {
            await deleteImageFromCloudinary(ifUserExist.picture)
        }
        return updatedDoctor;

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError(httpStatusCode.BAD_REQUEST, "Doctor update failed");
    }
};
const getAllDoctors = async (query: Record<string, string>) => {
    const aggBuilder = new AggregationQueryBuilder(query);

    const pipeline = aggBuilder
        .lookup("user", "users") // 'user' field from 'users' collection
        .lookup("specialization", "specializations") // same for specialization
        .filter()
        .search(doctorSearChQueryFields) // searching nested fields
        .sort()
        .fields()
        .paginate()
        .build();

    const data = await Doctor.aggregate(pipeline);
    const meta = await aggBuilder.getMeta(Doctor);

    return {
        data,
        meta,
    };
};

const getSingleDoctor = async (doctorId: string) => {
    const findDoctor = await Doctor.findById(doctorId).populate("user")
    if (!findDoctor) {
        throw new AppError(httpStatusCode.NOT_FOUND, "doctor not found")
    }
    const isUserExist = await User.findById(findDoctor.user)
    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "doctor user info not found")
    }

    return findDoctor
}

const getAvailableSlots = async (doctorId: string, date: string) => {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");
    if (!date) throw new Error("date not found");

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dayOfWeek = daysOfWeek[new Date(date).getDay()];

    // doctor-এর ওই দিনের availability বের করা
    const availability = doctor?.availableTimes.find((slot) => slot.day === dayOfWeek);
    if (!availability) return [];

    // slot generate করা
    let slots = generateSlots(availability.startTime, availability.endTime, availability.slotDuration);

    // already booked slot বের করা
    const bookedSlots = await Booking.find({ doctor: doctorId, date, status: BOOKING_STATUS.COMPLETE });

    // available slot filter করা
    slots = slots.filter(
        (slot) =>
            !bookedSlots.some(
                (b) => b.startTime === slot.startTime && b.endTime === slot.endTime
            )
    );

    return slots;
};


export const doctorServices = {
    addDoctor,
    addSpecialize,
    updateSpecialize,
    getAllSpecialize,
    updateDoctor,
    rejectRequest,
    getAllDoctors,
    getSingleDoctor,
    getAvailableSlots
}