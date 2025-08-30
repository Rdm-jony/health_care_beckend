import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";

const router=Router()

router.post("/create",checkAuth(Role.USER),validateRequest(createBookingZodSchema),bookingController.createBooking)

export const bookingRoutes=router