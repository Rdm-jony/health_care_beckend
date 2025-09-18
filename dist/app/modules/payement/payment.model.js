import { model, Schema } from "mongoose";
import { PAYMENT_STATUS } from "./payment.interface.js";
const paymentSchema = new Schema({
    booking: { type: Schema.Types.ObjectId, required: true, ref: "Booking" },
    amount: { type: Number, required: true },
    invoiceUrl: { type: String },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.UNPAID },
    transactionId: { type: String, required: true }
}, {
    timestamps: true
});
export const Payment = model("Payment", paymentSchema);
