import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller.js";
import passport from "passport";
import { envVars } from "../../config/env.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../user/user.interface.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { changePasswordShema, forgetPasswordSchema, loginShema, resetPasswordSchema, setPasswordShema } from "./auth.validation.js";

const router = Router()

router.post("/login", validateRequest(loginShema), authController.credentialsLogin)
router.post("/refresh-token", authController.getNewAccessToken)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || ""
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect as string
    })(req, res, next)
})

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: `${envVars.FRONT_END_URL}/login`,
}), authController.googleCallback)

router.post("/change-password", checkAuth(...Object.values(Role)), validateRequest(changePasswordShema), authController.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), validateRequest(setPasswordShema), authController.setPassword)
router.post("/logout", authController.logout)
router.post("/forget-password",validateRequest(forgetPasswordSchema), authController.forgetPassword)
router.post("/reset-password",checkAuth(...Object.values(Role)),validateRequest(resetPasswordSchema), authController.resetPassword)

export const authRoutes = router