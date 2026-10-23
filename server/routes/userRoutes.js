import express from "express";
import {
    updateProfile,
    getUserProfile,
    getUserById,
    getFreelancers,
} from "../controllers/userController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/profile",
    requireAuth,
    getUserProfile
);

router.put(
    "/profile",
    requireAuth,
    updateProfile
);

router.get(
    "/freelancers",
    getFreelancers
);

router.get(
    "/:id",
    getUserById
);

export default router;