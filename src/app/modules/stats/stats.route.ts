import express from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../user/user.interface.js";
import { StatsController } from "./stats.controller.js";

const router = express.Router();



router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getUserStats
);
router.get(
    "/specialize",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getSpecializeStats
);
router.get(
    "/doctor",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsController.getDoctorStats
);


export const statsRoutes = router;