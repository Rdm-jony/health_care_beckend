import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { doctorServices } from "./doctor.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"


const addSpecialize = catchAsync(async (req: Request, res: Response) => {
    const newSpecialization = await doctorServices.addSpecialize(req.body)

    sendResponse(res, {
        data: newSpecialization,
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

export const doctorControllers = {
    addDoctor,
    addSpecialize,
    updateSpecialize,
    getAllSpecialize
}