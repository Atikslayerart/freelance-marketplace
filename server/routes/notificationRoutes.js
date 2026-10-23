import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getNotifications);

router.put("/read-all", markAllNotificationsRead);

router.put("/:id/read", markNotificationRead);

export default router;