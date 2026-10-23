import HireRequest from "../models/HireRequest.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const createHireRequest = async (req, res) => {
    try {
        const { freelancerId, jobId, message } =
            req.body;

        if (!freelancerId || !jobId) {
            return res.status(400).json({
                success: false,
                message:
                    "Freelancer and job are required.",
            });
        }

        const freelancer =
            await User.findById(freelancerId);

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message:
                    "Freelancer not found.",
            });
        }

        if (freelancer.role !== "freelancer") {
            return res.status(400).json({
                success: false,
                message:
                    "You can only hire freelancers.",
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }

        if (
            job.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only invite freelancers to your own jobs.",
            });
        }

        const existingRequest =
            await HireRequest.findOne({
                client: req.user._id,
                freelancer: freelancerId,
                job: jobId,
                status: "pending",
            });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message:
                    "You have already sent an invitation for this job.",
            });
        }

        const hireRequest =
            await HireRequest.create({
                client: req.user._id,
                freelancer: freelancerId,
                job: jobId,
                message: message || "",
            });

        res.status(201).json({
            success: true,
            message:
                "Hire invitation sent successfully.",
            hireRequest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to send hire invitation.",
        });
    }
};

export const getMyHireRequests = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === "freelancer") {
            query.freelancer = req.user._id;
        }

        if (req.user.role === "client") {
            query.client = req.user._id;
        }

        const hireRequests =
            await HireRequest.find(query)
                .populate(
                    "client",
                    "name email avatar"
                )
                .populate(
                    "freelancer",
                    "name email avatar"
                )
                .populate(
                    "job",
                    "title budget budgetType category"
                )
                .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: hireRequests.length,
            hireRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch hire requests.",
        });
    }
};

export const updateHireRequestStatus = async (
    req,
    res
) => {
    try {
        const { status } = req.body;

        if (
            !["accepted", "rejected"].includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be accepted or rejected.",
            });
        }

        const hireRequest =
            await HireRequest.findById(
                req.params.id
            );

        if (!hireRequest) {
            return res.status(404).json({
                success: false,
                message:
                    "Hire request not found.",
            });
        }

        if (
            hireRequest.freelancer.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only update your own hire requests.",
            });
        }

        hireRequest.status = status;

        await hireRequest.save();

        res.status(200).json({
            success: true,
            message: `Hire request ${status}.`,
            hireRequest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update hire request.",
        });
    }
};