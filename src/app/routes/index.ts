import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { otpRoutes } from "../modules/otp/otp.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { bookingRoutes } from "../modules/booking/booking.route";
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
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))