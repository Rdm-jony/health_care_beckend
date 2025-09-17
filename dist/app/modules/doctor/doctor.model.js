"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = exports.Specialization = void 0;
const mongoose_1 = require("mongoose");
const doctor_interface_1 = require("./doctor.interface");
const specializationShema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String }
});
exports.Specialization = (0, mongoose_1.model)("Specialization", specializationShema);
const availableTimesSchema = new mongoose_1.Schema({
    day: { type: String, enum: Object.values(doctor_interface_1.DayOfWeek), required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true }
}, {
    timestamps: false,
    _id: false,
    versionKey: false
});
const doctorSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Specialization",
        required: true
    }
}, {
    timestamps: true
});
exports.Doctor = (0, mongoose_1.model)("Doctor", doctorSchema);
