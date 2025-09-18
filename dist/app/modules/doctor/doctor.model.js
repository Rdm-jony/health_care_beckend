import { model, Schema } from "mongoose";
import { DayOfWeek } from "./doctor.interface.js";
const specializationShema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String }
});
export const Specialization = model("Specialization", specializationShema);
const availableTimesSchema = new Schema({
    day: { type: String, enum: Object.values(DayOfWeek), required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true }
}, {
    timestamps: false,
    _id: false,
    versionKey: false
});
const doctorSchema = new Schema({
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
    },
    embedding: { type: [Number], default: [] }
}, {
    timestamps: true
});
export const Doctor = model("Doctor", doctorSchema);
