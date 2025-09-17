import { Router } from "express"
import { chatController } from "./chat.controller"

const router=Router()

router.post("/create",chatController.conversation)

export const chatRoutes=router