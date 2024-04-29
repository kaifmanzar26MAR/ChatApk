import { Router } from "express";
import { getAllConversationMessage, sendMessage } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router();

router.post('/sendmessage',verifyJWT, sendMessage);
router.post('/getallconversationmessage', verifyJWT, getAllConversationMessage)

export default router