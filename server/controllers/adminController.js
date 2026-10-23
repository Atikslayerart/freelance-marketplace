import User from "../models/User.js";
import Job from "../models/Job.js";
import Project from "../models/Project.js";
import ContactMessage from "../models/ContactMessage.js";

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalFreelancers,
            totalClients,
            totalJobs,
            activeProjects,
            newContactMessages,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "freelancer" }),
            User.countDocuments({ role: "client" }),
            Job.countDocuments(),
            Project.countDocuments({ status: "active" }),
            ContactMessage.countDocuments({ status: "new" }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalFreelancers,
                totalClients,
                totalJobs,
                activeProjects,
                newContactMessages,
            },
        });
    } catch (error) {
        console.error("Get admin stats error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch admin stats.",
        });
    }
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
    try {
        const { role, status, search, page = 1, limit = 10 } =
            req.query;

        const query = {};

        if (role && role !== "all") {
            query.role = role;
        }

        if (status && status !== "all") {
            query.isActive = status === "active";
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const [users, totalUsers] = await Promise.all([
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize),
            User.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalUsers / pageSize),
                totalUsers,
                hasNextPage:
                    pageNumber <
                    Math.ceil(totalUsers / pageSize),
                hasPrevPage: pageNumber > 1,
            },
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch users.",
        });
    }
};

// PUT /api/admin/users/:id/status
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false.",
            });
        }

        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot deactivate your own admin account.",
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User status updated successfully.",
            data: user,
        });
    } catch (error) {
        console.error("Update user status error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update user status.",
        });
    }
};

// GET /api/admin/contact-messages
export const getContactMessages = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } =
            req.query;

        const query = {};

        if (status && status !== "all") {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ];
        }

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const [messages, totalMessages] = await Promise.all([
            ContactMessage.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize),
            ContactMessage.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            data: messages,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(
                    totalMessages / pageSize
                ),
                totalMessages,
                hasNextPage:
                    pageNumber <
                    Math.ceil(totalMessages / pageSize),
                hasPrevPage: pageNumber > 1,
            },
        });
    } catch (error) {
        console.error(
            "Get contact messages error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to fetch contact messages.",
        });
    }
};

// PUT /api/admin/contact-messages/:id/status
export const updateContactMessageStatus = async (
    req,
    res
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (
            !["new", "in-progress", "resolved"].includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid status.",
            });
        }

        const message =
            await ContactMessage.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully.",
            data: message,
        });
    } catch (error) {
        console.error(
            "Update contact message status error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update message status.",
        });
    }
};
// PATCH /api/admin/users/:id
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, isActive } = req.body;

        const updates = {};

        if (role) {
            updates.role = role;
        }

        if (typeof isActive === "boolean") {
            updates.isActive = isActive;
        }

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Unable to update user",
        });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Unable to delete user",
        });
    }
};
// GET /api/admin/jobs
export const getAdminJobs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const status = req.query.status || "all";

        const query = {};

        if (search) {
            query.title = {
                $regex: search,
                $options: "i",
            };
        }

        if (status !== "all") {
            query.status = status;
        }

        const totalJobs = await Job.countDocuments(query);

        const jobs = await Job.find(query)
            .populate("client", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: jobs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalJobs / limit),
                totalJobs,
                hasPrevPage: page > 1,
                hasNextPage: page * limit < totalJobs,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Unable to load jobs",
        });
    }
};

// PATCH /api/admin/jobs/:id/status
export const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const job = await Job.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job status updated successfully",
            data: job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Unable to update job status",
        });
    }

};


// DELETE /api/admin/jobs/:id
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findByIdAndDelete(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Unable to delete job",
        });
    }
};



// GET /api/admin/projects
export const getAdminProjects = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const status = req.query.status || "all";

        const query = {};

        if (search) {
            query.title = {
                $regex: search,
                $options: "i",
            };
        }

        if (status !== "all") {
            query.status = status;
        }

        const totalProjects =
            await Project.countDocuments(query);

        const projects = await Project.find(query)
            .populate("client", "name email")
            .populate("freelancer", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: projects,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(
                    totalProjects / limit
                ),
                totalProjects,
                hasPrevPage: page > 1,
                hasNextPage: page * limit < totalProjects,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to load projects",
        });
    }
};

// PATCH /api/admin/projects/:id/status
export const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const project =
            await Project.findByIdAndUpdate(
                id,
                { status },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Project status updated successfully",
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to update project status",
        });
    }
};

// DELETE /api/admin/projects/:id
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project =
            await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to delete project",
        });
    }
};