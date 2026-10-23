import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Client is required"],
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Freelancer is required"],
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job is required"],
        },

        proposal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Proposal",
            required: [true, "Proposal is required"],
        },

        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        budget: {
            type: Number,
            required: [true, "Project budget is required"],
            min: [1, "Project budget must be greater than 0"],
        },

        deadline: {
            type: Date,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "active",
                "submitted",
                "revision",
                "completed",
                "cancelled",
            ],
            default: "active",
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;