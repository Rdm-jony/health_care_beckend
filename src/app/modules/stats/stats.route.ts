import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

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