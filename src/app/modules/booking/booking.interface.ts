import { Types } from "mongoose";

export enum BOOKING_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    CASH="CASH",
    FAILED = "FAILED"
}
export interface IBooking {
    doctor: Types.ObjectId,
    user: Types.ObjectId,
    bookingDate:Date,
    startTime: string; 
    endTime: string;
    status: BOOKING_STATUS,
    payment?: Types.ObjectId | null,
}