import express from "express";
import {
    createHireRequest,
    getMyHireRequests,
    updateHireRequestStatus,
} from "../controllers/hireRequestController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    requireAuth,
    createHireRequest
);

router.get(
    "/my-requests",
    requireAuth,
    getMyHireRequests
);

router.put(
    "/:id/status",
    requireAuth,
    updateHireRequestStatus
);

export default router;