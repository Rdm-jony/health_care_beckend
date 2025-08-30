import { model, Schema } from "mongoose";
import { DayOfWeek, IAvailableSlot, IDoctor, ISpecialization } from "./doctor.interface";

const specializationShema = new Schema<ISpecialization>({
    name: { type: String, required: true, unique: true, trim: true },
})

export const Specialization = model("Specialization", specializationShema)

const availableTimesSchema = new Schema<IAvailableSlot>({
    day: { type: String, enum: Object.values(DayOfWeek), required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true }
}, {
    timestamps: false,
    _id: false,
    versionKey: false
})

const doctorSchema = new Schema<IDoctor>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    about: { type: String, required: true },
    availableTimes: [availableTimesSchema],
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