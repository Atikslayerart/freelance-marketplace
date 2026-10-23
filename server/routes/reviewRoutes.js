import express from "express";
import {
    createReview,
    getUserReviews,
} from "../controllers/reviewController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/project/:projectId", requireAuth, createReview);

router.get("/user/:userId", getUserReviews);

export default router;