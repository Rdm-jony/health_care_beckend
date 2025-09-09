"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBookingZodSchema = zod_1.default.object({
    doctor: zod_1.default.string().min(1, "doctor id required"),
    bookingDate: zod_1.default.string(),
    startTime: zod_1.default
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
    endTime: zod_1.default
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
});
