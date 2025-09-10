import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { doctorServices } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import { IDoctor, ISpecialization } from "./doctor.interface";


const addSpecialize = catchAsync(async (req: Request, res: Response) => {
    const payload = {
        image: req?.file?.path,
        ...req.body
    }
    const newSpecialize = await doctorServices.addSpecialize(payload)

    sendResponse(res, {
        data: newSpecialize,
        message: "doctor specializaion create succesfully!",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const updateSpecialize = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const payload: Partial<ISpecialization> = {
        image: req?.file?.path,
        ...req.body
    }
    const updatedSpecialization = await doctorServices.updateSpecialize(id, payload)

    sendResponse(res, {
        data: updatedSpecialization,
        message: "specializaion update succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

const getAllSpecialize = catchAsync(async (req: Request, res: Response) => {
    const allSpecialize = await doctorServices.getAllSpecialize()

    sendResponse(res, {
        data: allSpecialize,
        message: "allSpecialize retrived succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

const addDoctor = catchAsync(async (req: Request, res: Response) => {
    const newDoctor = await doctorServices.addDoctor(req.body)

    sendResponse(res, {
        data: newDoctor,
        message: "doctor create succesfully!",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const rejectRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    await doctorServices.rejectRequest(userId)

    sendResponse(res, {
        data: null,
        message: "permit To doctor reject!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>

    const allDoctors = await doctorServices.getAllDoctors(query)

    sendResponse(res, {
        data: allDoctors.data,
        message: "all doctor retrieved succesfully!",
        statusCode: httpStatusCode.OK,
        success: true,
        meta: allDoctors.meta
    })
})
const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const doctor = await doctorServices.getSingleDoctor(id)

    sendResponse(res, {
        data: doctor,
        message: "single doctor retrieved succesfully!",
        statusCode: httpStatusCode.OK,
        success: true,
    })
})

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.id

    const decodedToken = req.user as JwtPayload
    const payload: Partial<IUser> & Partial<IDoctor> = {
        picture: req?.file?.path,
        ...req.body
    }
    const updatedDoctor = await doctorServices.updateDoctor(doctorId, decodedToken, payload)

    sendResponse(res, {
        data: updatedDoctor,
        message: "doctor update succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

const getAvailableSlots = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.id
    const date = req.query.date as string


    const slots = await doctorServices.getAvailableSlots(doctorId, date)

    sendResponse(res, {
        data: slots,
        message: "doctor slot retrive succesfully!",
        statusCode: httpStatusCode.OK,
        success: true
    })
})




export const doctorControllers = {
    addDoctor,
    addSpecialize,
    updateSpecialize,
    getAllSpecialize,
    updateDoctor,
    rejectRequest,
    getAllDoctors,
    getSingleDoctor,
    getAvailableSlots
}