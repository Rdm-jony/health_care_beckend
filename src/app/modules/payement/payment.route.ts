import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { paymentController } from "./payment.controller";

const router = Router()
router.post("/init/:bookingId", checkAuth(Role.USER), paymentController.initPayment)


export const paymentRoutes = router