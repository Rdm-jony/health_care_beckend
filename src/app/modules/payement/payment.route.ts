import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { paymentController } from "./payment.controller";

const router = Router()
router.post("/init/:bookingId", checkAuth(Role.USER), paymentController.initPayment)
router.post('/success', paymentController.successPayment)
router.post('/cancel', paymentController.cancelPayment)
router.post('/fail', paymentController.failPayment)


export const paymentRoutes = router