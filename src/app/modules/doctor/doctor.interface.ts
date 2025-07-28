import { Types } from "mongoose";
export interface ISpecialization{
    name:string,
}
export interface IDoctor{
    user:Types.ObjectId,
    slug:string,
    specialization:Types.ObjectId,
    licenceNumber:string,
    availableTimes:string[],
    degree:string,
    experience:number,
    fees:number,
    about:string
}