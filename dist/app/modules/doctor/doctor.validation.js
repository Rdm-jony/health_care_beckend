"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctorZodSchema = exports.createDoctorZodSchema = exports.specializationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const doctor_interface_1 = require("./doctor.interface");
exports.specializationSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "name is required" }).min(1, "About must not be empty")
});
// Slot schema
const AvailableSlotSchema = zod_1.z
    .object({
    day: zod_1.z.enum(Object.values(doctor_interface_1.DayOfWeek)),
    startTime: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    slotDuration: zod_1.z
        .number()
        .min(5, "Minimum slot duration is 5 minutes")
        .max(120, "Maximum slot duration is 120 minutes"),
})
    .refine((data) => {
    // Ensure endTime is after startTime
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return end > start;
}, {
    message: "endTime must be later than startTime",
    path: ["endTime"],
});
exports.createDoctorZodSchema = zod_1.z.object({
    user: zod_1.z
        .string({ message: "User ID is required" })
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid User ID",
    }),
    about: zod_1.z
        .string({ message: "About is required" })
        .min(1, "About must not be empty"),
    availableTimes: zod_1.z
        .array(AvailableSlotSchema)
        .nonempty("At least one available slot is required"),
    degree: zod_1.z
        .string({ message: "Degree is required" })
        .min(1, "Degree must not be empty"),
    experience: zod_1.z
        .number({ message: "Experience is required" })
        .min(0, "Experience cannot be negative"),
    fees: zod_1.z
        .number({ message: "Fees is required" })
        .min(0, "Fees must be a positive number"),
    licenceNumber: zod_1.z
        .string({ message: "Licence number is required" })
        .min(1, "Licence number must not be empty"),
    specialization: zod_1.z
        .string({ message: "Specialization ID is required" })
        .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid Specialization ID",
    }),
});
exports.updateDoctorZodSchema = zod_1.z.object({
    name: zod_1.z.string("not a string")
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    phone: zod_1.z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .or(zod_1.z.literal("")),
    address: zod_1.z.string(),
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHER"], "Select gender").optional(),
    about: zod_1.z.string().min(1, "About is required"),
    availableTimes: zod_1.z
        .array(AvailableSlotSchema)
        .nonempty("At least one available slot is required"),
    degree: zod_1.z.string().min(1, "Degree is required"),
    experience: zod_1.z.coerce.number().min(0),
    fees: zod_1.z.coerce.number().min(0),
    licenceNumber: zod_1.z.string().min(1, "Licence number is required"),
    specialization: zod_1.z.string().min(1, "Specialization is required"),
});
