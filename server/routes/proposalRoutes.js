import express from "express";
import {
    submitProposal,
    getMyProposals,
    getJobProposals,
    updateProposalStatus,
} from "../controllers/proposalController.js";
import requireAuth from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/:jobId",
    requireAuth,
    requireRole(["freelancer"]),
    submitProposal
);

router.get(
    "/my-proposals",
    requireAuth,
    requireRole(["freelancer"]),
    getMyProposals
);

router.get(
    "/job/:jobId",
    requireAuth,
    requireRole(["client"]),
    getJobProposals
);

router.put(
    "/:proposalId/status",
    requireAuth,
    requireRole(["client"]),
    updateProposalStatus
);

export default router;