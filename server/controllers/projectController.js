import Project from "../models/Project.js";

export const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { client: req.user._id },
                { freelancer: req.user._id },
            ],
        })
            .populate("client", "name avatar")
            .populate("freelancer", "name avatar skills hourlyRate")
            .populate("job", "title category status deadline")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch projects.",
        });
    }
};

export const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "active",
            "submitted",
            "revision",
            "completed",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project status.",
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        const isClient = project.client.toString() === req.user._id.toString();
        const isFreelancer =
            project.freelancer.toString() === req.user._id.toString();

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this project.",
            });
        }

        project.status = status;

        if (status === "completed") {
            project.completedAt = new Date();
        }

        await project.save();

        return res.status(200).json({
            success: true,
            message: `Project marked as ${status}.`,
            project,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update project.",
        });
    }
};