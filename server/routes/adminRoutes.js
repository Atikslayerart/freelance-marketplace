import express from "express";
import {
    getAdminStats,
    getUsers,
    updateUser,
    deleteUser,
    getContactMessages,
    updateContactMessageStatus,
} from "../controllers/adminController.js";

import {
    getAdminJobs,
    updateJobStatus,
    deleteJob,
} from "../controllers/adminController.js";

import {
    getAdminProjects,
    updateProjectStatus,
    deleteProject,
} from "../controllers/adminController.js";


import requireAuth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(requireAuth);
router.use(requireRole(["admin"]));

// Dashboard stats
// GET /api/admin/stats
router.get("/stats", getAdminStats);

// Users
// GET /api/admin/users
router.get("/users", getUsers);

// PATCH /api/admin/users/:id
router.patch("/users/:id", updateUser);

// DELETE /api/admin/users/:id
router.delete("/users/:id", deleteUser);

// Contact messages
// GET /api/admin/contact-messages
router.get("/contact-messages", getContactMessages);

// PUT /api/admin/contact-messages/:id/status
router.put(
    "/contact-messages/:id/status",
    updateContactMessageStatus
);

router.get("/jobs", getAdminJobs);
router.patch("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);

router.get("/projects", getAdminProjects);
router.patch("/projects/:id/status", updateProjectStatus);
router.delete("/projects/:id", deleteProject);

export default router;