import { Router } from "express";
import { doctorControllers } from "./doctor.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDoctorZodSchema, specializationSchema } from "./doctor.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

// doctor specialize
router.post("/specialize/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(specializationSchema), doctorControllers.addSpecialize)
router.get("/specialize/all", doctorControllers.getAllSpecialize)
router.patch("/specialize/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(specializationSchema), doctorControllers.updateSpecialize)

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDoctorZodSchema), doctorControllers.addDoctor)
export const doctorRoutes = router