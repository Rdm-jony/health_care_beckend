import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { otpRoutes } from "../modules/otp/otp.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { paymentRoutes } from "../modules/payement/payment.route";
import { statsRoutes } from "../modules/stats/stats.route";
import { chatRoutes } from "../modules/chat/chat.route";
export const router = Router()
const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/otp",
        route: otpRoutes
    },
    {
        path: "/doctor",
        route: doctorRoutes
    },
    {
        path: "/booking",
        route: bookingRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    },
    {
        path: "/stats",
        route: statsRoutes
    },
    {
        path: "/chat",
        route: chatRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))