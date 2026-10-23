import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const portfolioSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [
                true,
                "Project title is required",
            ],
            trim: true,
            maxlength: [
                100,
                "Project title cannot exceed 100 characters",
            ],
        },

        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                1000,
                "Project description cannot exceed 1000 characters",
            ],
        },

        imageUrl: {
            type: String,
            default: "",
        },

        projectUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [
                true,
                "Name is required",
            ],
            trim: true,
            minlength: [
                2,
                "Name must be at least 2 characters",
            ],
            maxlength: [
                60,
                "Name cannot exceed 60 characters",
            ],
        },

        email: {
            type: String,
            required: [
                true,
                "Email is required",
            ],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [
                true,
                "Password is required",
            ],
            minlength: [
                6,
                "Password must be at least 6 characters",
            ],
            select: false,
        },

        role: {
            type: String,
            enum: [
                "freelancer",
                "client",
                "admin",
            ],
            default: "freelancer",
        },

        avatar: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: [
                1000,
                "Bio cannot exceed 1000 characters",
            ],
        },

        location: {
            type: String,
            default: "",
            maxlength: [
                100,
                "Location cannot exceed 100 characters",
            ],
        },

        skills: {
            type: [String],
            default: [],
        },

        hourlyRate: {
            type: Number,
            default: null,
            min: [
                0,
                "Hourly rate cannot be negative",
            ],
        },

        portfolio: {
            type: [portfolioSchema],
            default: [],
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        companyName: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                100,
                "Company name cannot exceed 100 characters",
            ],
        },

        companyWebsite: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                255,
                "Company website cannot exceed 255 characters",
            ],
        },

        companyDescription: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                1000,
                "Company description cannot exceed 1000 characters",
            ],
        },

        industry: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                100,
                "Industry cannot exceed 100 characters",
            ],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model(
    "User",
    userSchema
);

export default User;