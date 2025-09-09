"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const otp_route_1 = require("../modules/otp/otp.route");
const doctor_route_1 = require("../modules/doctor/doctor.route");
const booking_route_1 = require("../modules/booking/booking.route");
const payment_route_1 = require("../modules/payement/payment.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes
    },
    {
        path: "/otp",
        route: otp_route_1.otpRoutes
    },
    {
        path: "/doctor",
        route: doctor_route_1.doctorRoutes
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRoutes
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoutes
    }
];
moduleRoutes.forEach(route => exports.router.use(route.path, route.route));
