import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()



router.post('/create', validateRequest(createUserZodSchema), userController.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUser)

export const userRoutes = router