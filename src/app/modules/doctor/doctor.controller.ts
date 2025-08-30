import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { doctorServices } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";


const addSpecialize = catchAsync(async (req: Request, res: Response) => {
    const newSpecialize = await doctorServices.addSpecialize(req.body)

    sendResponse(res, {
        data: newSpecialize,
        message: "doctor specializaion create succesfully!",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const updateSpecialize = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const updatedSpecialization = await doctorServices.updateSpecialize(id, req.body)

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
const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.id

    const decodedToken = req.user as JwtPayload
    const updatedDoctor = await doctorServices.updateDoctor(doctorId, decodedToken, req.body)

    sendResponse(res, {
        data: updatedDoctor,
        message: "doctor update succesfully!",
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
    rejectRequest
}