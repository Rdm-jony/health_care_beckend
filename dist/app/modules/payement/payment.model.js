"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    booking: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Booking" },
    amount: { type: Number, required: true },
    invoiceUrl: { type: String },
    status: { type: String, enum: Object.values(payment_interface_1.PAYMENT_STATUS), default: payment_interface_1.PAYMENT_STATUS.UNPAID },
    transactionId: { type: String, required: true }
}, {
    timestamps: true
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
