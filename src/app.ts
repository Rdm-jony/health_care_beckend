import express, { Request, Response } from "express";
const app=express()

app.get('/',async(req:Request,res:Response)=>{
    res.json(200).send({success:true,message:"user auth server running...✔"})
})

export default app