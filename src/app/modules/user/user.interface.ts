import { Types } from "mongoose";


export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    DOCTOR = "DOCTOR",
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}

export interface IAuthProvider {
    provider: "google" | "credentials",
    providerId: string
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?: string,
    phone: string,
    gender:Gender,
    address: string,
    picture?: string,
    isDeleted?: boolean,
    isVerified?: boolean,
    role: Role,
    auth: IAuthProvider[]

}