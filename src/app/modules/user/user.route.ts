import {  Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router()



router.post('/create', validateRequest(createUserZodSchema), userController.createUser)

export const userRoutes = router