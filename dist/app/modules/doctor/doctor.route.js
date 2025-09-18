import { Router } from "express";
import { doctorControllers } from "./doctor.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createDoctorZodSchema, specializationSchema, updateDoctorZodSchema } from "./doctor.validation.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../user/user.interface.js";
import { multerUpload } from "../../config/multer.config.js";
const router = Router();
// doctor specialize
router.post("/specialize/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), validateRequest(specializationSchema), doctorControllers.addSpecialize);
router.get("/specialize/all", doctorControllers.getAllSpecialize);
router.patch("/specialize/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), validateRequest(specializationSchema), doctorControllers.updateSpecialize);
router.post("/request-approve", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDoctorZodSchema), doctorControllers.addDoctor);
router.get("/all", doctorControllers.getAllDoctors);
router.get("/:id", doctorControllers.getSingleDoctor);
router.get("/slots/:id", doctorControllers.getAvailableSlots);
router.patch(`/request-reject/:id`, checkAuth(Role.ADMIN, Role.SUPER_ADMIN), doctorControllers.rejectRequest);
router.patch("/:id", checkAuth(Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), validateRequest(updateDoctorZodSchema), doctorControllers.updateDoctor);
export const doctorRoutes = router;
