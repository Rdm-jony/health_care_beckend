import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";

const router = Router()

router.post("/create", checkAuth(Role.USER), validateRequest(createBookingZodSchema), bookingController.createBooking)
router.get("/user/me", checkAuth(Role.USER), bookingController.getUserBookings)
router.get("/doctor/me", checkAuth(Role.DOCTOR), bookingController.getAllDoctorBookings)
router.patch("/cash/:id", checkAuth(Role.DOCTOR), bookingController.cashBooking)

export const bookingRoutes = router