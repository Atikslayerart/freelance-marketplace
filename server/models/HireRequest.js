import mongoose from "mongoose";

const hireRequestSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        message: {
            type: String,
            default: "",
            maxlength: [
                1000,
                "Message cannot exceed 1000 characters",
            ],
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const HireRequest =
    mongoose.model(
        "HireRequest",
        hireRequestSchema
    );

export default HireRequest;