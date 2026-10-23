import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            skills,
            budgetType,
            budgetAmount,
            experienceLevel,
            deadline,
        } = req.body;

        const job = await Job.create({
            client: req.user._id,
            title,
            description,
            category,
            skills,
            budgetType,
            budgetAmount,
            experienceLevel,
            deadline,
        });

        return res.status(201).json({
            success: true,
            message: "Job posted successfully.",
            job,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to post job.",
        });
    }
};

export const getJobs = async (req, res) => {
    try {
        const {
            search,
            category,
            budgetType,
            minBudget,
            maxBudget,
            sortBy,
        } = req.query;

        const query = {
            status: "open",
        };

        if (search && search.trim()) {
            const searchRegex = new RegExp(
                search.trim(),
                "i"
            );

            query.$or = [
                {
                    title: searchRegex,
                },
                {
                    description: searchRegex,
                },
                {
                    skillsRequired: searchRegex,
                },
            ];
        }

        if (category && category !== "all") {
            query.category = category;
        }

        if (budgetType && budgetType !== "all") {
            query.budgetType = budgetType;
        }

        if (minBudget || maxBudget) {
            query.budgetAmount = {};

            if (minBudget) {
                query.budgetAmount.$gte =
                    Number(minBudget);
            }

            if (maxBudget) {
                query.budgetAmount.$lte =
                    Number(maxBudget);
            }
        }

        let sortQuery = {
            createdAt: -1,
        };

        if (sortBy === "budget-high") {
            sortQuery = {
                budgetAmount: -1,
            };
        }

        if (sortBy === "budget-low") {
            sortQuery = {
                budgetAmount: 1,
            };
        }

        const jobs = await Job.find(query)
            .populate(
                "client",
                "name avatar rating totalReviews"
            )
            .sort(sortQuery);

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch jobs.",
        });
    }
};
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ client: req.user._id }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch your jobs.",
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "client",
            "name avatar"
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }

        return res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch job.",
        });
    }
};
export const deleteJob = async (req, res) => {
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
                    "You are not authorized to delete this job.",
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete job.",
        });
    }
};
export const updateJob = async (req, res) => {
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
                    "You are not authorized to update this job.",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "skillsRequired",
            "budgetType",
            "budgetAmount",
            "deadline",
            "status",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedJob =
            await Job.findByIdAndUpdate(
                jobId,
                updates,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Job updated successfully.",
            job: updatedJob,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update job.",
        });
    }
};