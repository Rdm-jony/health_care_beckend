import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
    doctor: { type: Schema.Types.ObjectId, required: true, ref: "Doctor" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING }
}, {
    timestamps: true
})

export const Booking = model("Booking", bookingSchema)