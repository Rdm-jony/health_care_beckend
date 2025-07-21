/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import { envVars } from "./app/config/env";
import AppError from "./app/errorHelpers/AppError";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
const app=express()

app.use(express.json())
app.use("/api/v1",router)

app.get('/',async(req:Request,res:Response)=>{
    res.json(200).send({success:true,message:"user auth server running...✔"})
})

app.use(globalErrorHandler)

export default app