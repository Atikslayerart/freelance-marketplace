import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
    createJob,
    getJobs,
    getJobById,
    getMyJobs,
    updateJob,
    deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/", requireAuth, createJob);

router.get("/", getJobs);

router.get("/my-jobs", requireAuth, getMyJobs);

router.get("/:id", getJobById);

router.put("/:id", requireAuth, updateJob);

router.delete("/:id", requireAuth, deleteJob);

export default router;