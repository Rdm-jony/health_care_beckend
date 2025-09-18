import { Router } from "express";
import { chatController } from "./chat.controller.js";
const router = Router();
router.post("/create", chatController.conversation);
export const chatRoutes = router;
