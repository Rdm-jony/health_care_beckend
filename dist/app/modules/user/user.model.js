import { model, Schema } from "mongoose";
import { DoctorRequest, Gender, Role } from "./user.interface.js";
import { boolean } from "zod";
export const authProvideSchema = new Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    gender: { type: String, enum: Object.values(Gender) },
    isDeleted: { type: boolean, default: false },
    isVerified: { type: boolean, default: false },
    isBlocked: { type: boolean, default: false },
    phone: { type: String },
    picture: { type: String },
    permitToDoctor: { type: String, enum: Object.values(DoctorRequest), default: DoctorRequest.NONE },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auth: [authProvideSchema]
}, {
    timestamps: true
});
export const User = model("User", userSchema);
