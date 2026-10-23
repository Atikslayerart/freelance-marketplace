import Review from "../models/Review.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const createReview = async (req, res) => {
    try {
        const { projectId } = req.params;
        const {
            communication,
            quality,
            timeliness,
            overallRating,
            comment,
        } = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        if (project.status !== "completed") {
            return res.status(400).json({
                success: false,
                message:
                    "You can review only after the project is completed.",
            });
        }

        const isClient =
            project.client.toString() === req.user._id.toString();

        const isFreelancer =
            project.freelancer.toString() === req.user._id.toString();

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to review this project.",
            });
        }

        const existingReview = await Review.findOne({
            project: projectId,
            reviewer: req.user._id,
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this project.",
            });
        }

        const review = await Review.create({
            project: projectId,
            reviewer: req.user._id,
            reviewee: isClient ? project.freelancer : project.client,
            communication,
            quality,
            timeliness,
            overallRating,
            comment,
        });

        if (isClient) {
            await updateFreelancerRating(project.freelancer);
        }

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            review,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to submit review.",
        });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        const reviews = await Review.find({ reviewee: userId })
            .populate("reviewer", "name avatar")
            .populate("project", "title")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reviews.",
        });
    }
};

const updateFreelancerRating = async (freelancerId) => {
    const reviews = await Review.find({ reviewee: freelancerId });

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews === 0
            ? 0
            : reviews.reduce(
                (total, review) => total + review.overallRating,
                0
            ) / totalReviews;

    await User.findByIdAndUpdate(freelancerId, {
        rating: Math.round(averageRating * 10) / 10,
        totalReviews,
    });
};