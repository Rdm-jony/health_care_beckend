/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IDoctor, ISpecialization } from "./doctor.interface";
import httpStatusCode from "http-status-codes"
import { Doctor, Specialization } from "./doctor.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const addSpecialize = async (payload: ISpecialization) => {
    const existingSpecialize = await Specialization.findOne({ name: payload.name });

    if (existingSpecialize) {
        throw new Error("doctor specialization already exists.");
    }

    return await Specialization.create(payload);
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
        throw new AppError(httpStatusCode.NOT_FOUND, "user aleady a doctor")
    }
    const doctor = (await (await Doctor.create(payload)).populate("user")).populate("specialization")
    return doctor

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

        return updatedDoctor;

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new AppError(httpStatusCode.BAD_REQUEST, "Doctor update failed");
    }
};


export const doctorServices = {
    addDoctor,
    addSpecialize,
    updateSpecialize,
    getAllSpecialize,
    updateDoctor
}