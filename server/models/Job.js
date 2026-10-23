import mongoose from "mongoose";


const jobSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Client is required"],
        },


        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            minlength: [5, "Job title must be at least 5 characters"],
            maxlength: [120, "Job title cannot exceed 120 characters"],
        },


        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
            minlength: [20, "Job description must be at least 20 characters"],
            maxlength: [
                5000,
                "Job description cannot exceed 5000 characters",
            ],
        },


        category: {
            type: String,
            required: [true, "Job category is required"],
            enum: [
                "Web Development",
                "Design",
                "Mobile Apps",
                "Writing",
                "Marketing",
                "Video & Animation",
            ],
        },


        skills: {
            type: [String],
            default: [],
        },


        budgetType: {
            type: String,
            required: [true, "Budget type is required"],
            enum: ["fixed", "hourly"],
        },


        budgetAmount: {
            type: Number,
            required: [true, "Budget amount is required"],
            min: [1, "Budget amount must be greater than 0"],
        },


        experienceLevel: {
            type: String,
            required: [true, "Experience level is required"],
            enum: ["beginner", "intermediate", "expert"],
        },


        deadline: {
            type: Date,
            required: [true, "Deadline is required"],
        },


        attachments: {
            type: [String],
            default: [],
        },


        status: {
            type: String,
            enum: [
                "open",
                "in-progress",
                "completed",
                "cancelled",
                "closed",
            ],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);


const Job = mongoose.model("Job", jobSchema);


export default Job;