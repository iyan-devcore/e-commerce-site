import express from "express";
import { chat } from "../controller/chatbotControl.js";
import { optionalAuthMiddleware } from "../utils/optionalAuth.js";

const router = express.Router();

// POST /api/chatbot/chat — now checks for user identity optionally
router.post("/chat", optionalAuthMiddleware, chat);

export default router;
