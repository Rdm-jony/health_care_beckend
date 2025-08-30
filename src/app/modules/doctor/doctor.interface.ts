import { Types } from "mongoose";
export interface ISpecialization {
    name: string,
}

export enum DayOfWeek {
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday",
    SUNDAY = "Sunday",
}
export interface IAvailableSlot {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    slotDuration: number;
}
export interface IDoctor {
    user: Types.ObjectId,
    specialization: Types.ObjectId,
    licenceNumber: string,
    availableTimes: IAvailableSlot[],
    degree: string,
    experience: number,
    fees: number,
    about: string
}