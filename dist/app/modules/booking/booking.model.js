"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const booking_interface_1 = require("./booking.interface");
const bookingSchema = new mongoose_1.Schema({
    doctor: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Doctor" },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    startTime: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    endTime: { type: String, required: true },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    status: { type: String, enum: Object.values(booking_interface_1.BOOKING_STATUS), default: booking_interface_1.BOOKING_STATUS.PENDING }
}, {
    timestamps: true
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
