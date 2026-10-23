import express from "express";
import {
    getMyProjects,
    updateProjectStatus,
} from "../controllers/projectController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-projects", requireAuth, getMyProjects);

router.put("/:projectId/status", requireAuth, updateProjectStatus);

export default router;