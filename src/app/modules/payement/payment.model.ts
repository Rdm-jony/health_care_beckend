import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    booking: { type: Schema.Types.ObjectId, required: true, ref: "Booking" },
    amount: { type: Number, required: true },
    invoiceUrl: { type: String },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.UNPAID },
    transactionId: { type: String, required: true }
}, {
    timestamps: true
})

export const Payment = model("Payment", paymentSchema)