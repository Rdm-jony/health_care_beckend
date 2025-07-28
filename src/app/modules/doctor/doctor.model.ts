import { model, Schema } from "mongoose";
import { IDoctor, ISpecialization } from "./doctor.interface";

const specializationShema = new Schema<ISpecialization>({
    name: { type: String, required: true, unique: true },
})

export const Specialization = model("Specialization", specializationShema)

const doctorSchema = new Schema<IDoctor>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    slug: { type: String, unique: true },
    about: { type: String, required: true },
    availableTimes: [{ type: String, required: true }],
    degree: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    licenceNumber: { type: String, required: true },
    specialization: {
        type: Schema.Types.ObjectId,
        ref: "Specialization",
        required: true
    }
}, {
    timestamps: true
})

export const Doctor = model("Doctor", doctorSchema)