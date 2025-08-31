import { z } from "zod";
import mongoose from "mongoose";
import { DayOfWeek } from "./doctor.interface";

export const specializationSchema = z.object({
    name: z.string({ message: "name is required" }).min(1, "About must not be empty")
})

// Slot schema
const AvailableSlotSchema = z
    .object({
        day: z.enum(Object.values(DayOfWeek)),
        startTime: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
        endTime: z
            .string()
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
        slotDuration: z
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

export const createDoctorZodSchema = z.object({
    user: z
        .string({ message: "User ID is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid User ID",
        }),

    about: z
        .string({ message: "About is required" })
        .min(1, "About must not be empty"),

    availableTimes: z
        .array(AvailableSlotSchema)
        .nonempty("At least one available slot is required"),

    degree: z
        .string({ message: "Degree is required" })
        .min(1, "Degree must not be empty"),

    experience: z
        .number({ message: "Experience is required" })
        .min(0, "Experience cannot be negative"),

    fees: z
        .number({ message: "Fees is required" })
        .min(0, "Fees must be a positive number"),

    licenceNumber: z
        .string({ message: "Licence number is required" })
        .min(1, "Licence number must not be empty"),

    specialization: z
        .string({ message: "Specialization ID is required" })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid Specialization ID",
        }),
});

export const updateDoctorZodSchema = z.object({
    name: z.string("not a string")
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),

    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .or(z.literal("")),
    address: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], "Select gender").optional(),

    about: z.string().min(1, "About is required"),

    availableTimes: z
        .array(AvailableSlotSchema)
        .nonempty("At least one available slot is required"),
    degree: z.string().min(1, "Degree is required"),
    experience: z.coerce.number().min(0),
    fees: z.coerce.number().min(0),
    licenceNumber: z.string().min(1, "Licence number is required"),
    specialization: z.string().min(1, "Specialization is required"),
});