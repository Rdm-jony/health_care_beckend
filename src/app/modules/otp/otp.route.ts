import { Router } from "express";
import { otpController } from "./otp.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { sendOtpSchema, verfyOtpSchema } from "./otpValidation.js";

const router = Router()

router.post("/send",validateRequest(sendOtpSchema), otpController.sendOtp)
router.post("/verify",validateRequest(verfyOtpSchema), otpController.verifyOtp)

export const otpRoutes = router