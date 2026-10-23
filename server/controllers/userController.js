import User from "../models/User.js";

export const updateProfile = async (req, res) => {
    try {
        const {
            name,
            bio,
            location,
            skills,
            hourlyRate,
            portfolio,

            companyName,
            companyWebsite,
            companyDescription,
            industry,
        } = req.body;

        const updateData = {};

        if (name !== undefined) {
            updateData.name = name;
        }

        if (bio !== undefined) {
            updateData.bio = bio;
        }

        if (location !== undefined) {
            updateData.location = location;
        }

        if (skills !== undefined) {
            updateData.skills = skills;
        }

        if (hourlyRate !== undefined) {
            updateData.hourlyRate = hourlyRate;
        }

        if (Array.isArray(portfolio)) {
            updateData.portfolio = portfolio;
        }

        if (companyName !== undefined) {
            updateData.companyName = companyName;
        }

        if (companyWebsite !== undefined) {
            updateData.companyWebsite =
                companyWebsite;
        }

        if (companyDescription !== undefined) {
            updateData.companyDescription =
                companyDescription;
        }

        if (industry !== undefined) {
            updateData.industry = industry;
        }

        const updatedUser =
            await User.findByIdAndUpdate(
                req.user._id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update profile.",
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(
            req.params.id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch user.",
        });
    }
};

export const getFreelancers = async (req, res) => {
    try {
        const freelancers = await User.find({
            role: "freelancer",
        })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: freelancers.length,
            freelancers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch freelancers.",
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user._id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch profile.",
        });
    }
};