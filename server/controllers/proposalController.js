import Proposal from "../models/Proposal.js";
import Job from "../models/Job.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";

export const submitProposal = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter, bidAmount, deliveryTime } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }

        if (job.status !== "open") {
            return res.status(400).json({
                success: false,
                message:
                    "This job is no longer accepting proposals.",
            });
        }

        const existingProposal = await Proposal.findOne({
            job: jobId,
            freelancer: req.user._id,
        });

        if (existingProposal) {
            return res.status(409).json({
                success: false,
                message:
                    "You have already submitted a proposal for this job.",
            });
        }

        const proposal = await Proposal.create({
            job: jobId,
            freelancer: req.user._id,
            coverLetter,
            bidAmount,
            deliveryTime,
        });

        await Notification.create({
            recipient: job.client,
            type: "new_proposal",
            title: "New proposal received",
            message: `${req.user.name} applied to your job: ${job.title}`,
            link: `/client/jobs/${job._id}/proposals`,
        });

        return res.status(201).json({
            success: true,
            message: "Proposal submitted successfully.",
            proposal,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to submit proposal.",
        });
    }
};

export const getMyProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({
            freelancer: req.user._id,
        })
            .populate({
                path: "job",
                select: "title description category budgetType budgetAmount status deadline",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: proposals.length,
            proposals,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch your proposals.",
        });
    }
};

export const getJobProposals = async (req, res) => {
    try {
        const { jobId } = req.params;

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
                    "You are not authorized to view these proposals.",
            });
        }

        const proposals = await Proposal.find({
            job: jobId,
        })
            .populate(
                "freelancer",
                "name avatar skills hourlyRate rating totalReviews"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: proposals.length,
            proposals,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch proposals.",
        });
    }
};

export const updateProposalStatus = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "shortlisted",
            "accepted",
            "rejected",
            "withdrawn",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid proposal status.",
            });
        }

        const proposal = await Proposal.findById(
            proposalId
        ).populate("job");

        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found.",
            });
        }

        if (
            proposal.job.client.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this proposal.",
            });
        }

        proposal.status = status;
        await proposal.save();

        if (status === "accepted") {
            const existingProject = await Project.findOne({
                proposal: proposal._id,
            });

            if (!existingProject) {
                await Project.create({
                    client: proposal.job.client,
                    freelancer: proposal.freelancer,
                    job: proposal.job._id,
                    proposal: proposal._id,
                    title: proposal.job.title,
                    description: proposal.job.description,
                    budget: proposal.bidAmount,
                    deadline: proposal.job.deadline,
                    status: "active",
                });
            }

            await Job.findByIdAndUpdate(
                proposal.job._id,
                {
                    status: "in-progress",
                }
            );

            await Proposal.updateMany(
                {
                    job: proposal.job._id,
                    _id: { $ne: proposal._id },
                    status: {
                        $in: ["pending", "shortlisted"],
                    },
                },
                {
                    status: "rejected",
                }
            );

            await Notification.create({
                recipient: proposal.freelancer,
                type: "proposal_accepted",
                title: "Proposal accepted",
                message: `Your proposal for "${proposal.job.title}" was accepted.`,
                link: `/freelancer/my-proposals`,
            });
        }

        if (status === "rejected") {
            await Notification.create({
                recipient: proposal.freelancer,
                type: "proposal_rejected",
                title: "Proposal rejected",
                message: `Your proposal for "${proposal.job.title}" was rejected.`,
                link: `/freelancer/my-proposals`,
            });
        }

        const updatedProposal = await Proposal.findById(
            proposal._id
        ).populate("job");

        return res.status(200).json({
            success: true,
            message: `Proposal ${status} successfully.`,
            proposal: updatedProposal,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update proposal.",
        });
    }
};