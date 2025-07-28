import AppError from "../../errorHelpers/AppError";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { IDoctor, ISpecialization } from "./doctor.interface";
import httpStatusCode from "http-status-codes"
import { Doctor, Specialization } from "./doctor.model";

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

export const doctorServices = {
    addDoctor,
    addSpecialize,
    updateSpecialize,
    getAllSpecialize
}