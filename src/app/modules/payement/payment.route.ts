import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router()

router.post('/success', paymentController.successPayment)
router.post('/cancel', paymentController.cancelPayment)
router.post('/fail', paymentController.failPayment)

export const paymentRoutes = router