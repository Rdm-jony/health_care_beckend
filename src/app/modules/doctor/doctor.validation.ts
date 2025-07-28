import { z } from "zod";
import mongoose from "mongoose";

export const specializationSchema = z.object({
    name: z.string({ message: "name is required" }).min(1, "About must not be empty")
})

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
        .array(z.string().min(1, "Time slot cannot be empty"))
        .nonempty("At least one available time is required"),

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
        })

});
