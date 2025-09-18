import z from "zod";
export const createBookingZodSchema = z.object({
    doctor: z.string().min(1, "doctor id required"),
    bookingDate: z.string(),
    startTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
});
