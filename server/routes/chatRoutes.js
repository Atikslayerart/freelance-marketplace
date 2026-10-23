import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
    getOrCreateConversation,
    getConversations,
    getMessages,
    sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/conversations", getConversations);

router.get("/conversations/:userId", getOrCreateConversation);

router.get("/messages/:conversationId", getMessages);

router.post("/messages/:conversationId", sendMessage);

export default router;