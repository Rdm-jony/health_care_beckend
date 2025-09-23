import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { authRoutes } from "../modules/auth/auth.route.js";
import { otpRoutes } from "../modules/otp/otp.route.js";
import { doctorRoutes } from "../modules/doctor/doctor.route.js";
import { bookingRoutes } from "../modules/booking/booking.route.js";
import { paymentRoutes } from "../modules/payement/payment.route.js";
import { statsRoutes } from "../modules/stats/stats.route.js";
import { chatRoutes } from "../modules/chat/chat.route.js";
export const router = Router();
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
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
