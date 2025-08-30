import z from "zod";

export const createBookingZodSchema = z.object({
    doctor: z.string().min(1, "doctor id required"),
})