import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job is required"],
        },

        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Freelancer is required"],
        },

        coverLetter: {
            type: String,
            required: [true, "Cover letter is required"],
            trim: true,
            minlength: [20, "Cover letter must be at least 20 characters"],
            maxlength: [
                3000,
                "Cover letter cannot exceed 3000 characters",
            ],
        },

        bidAmount: {
            type: Number,
            required: [true, "Bid amount is required"],
            min: [1, "Bid amount must be greater than 0"],
        },

        deliveryTime: {
            type: String,
            required: [true, "Estimated delivery time is required"],
            enum: [
                "1 day",
                "3 days",
                "7 days",
                "14 days",
                "30 days",
            ],
        },

        attachments: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: [
                "pending",
                "shortlisted",
                "accepted",
                "rejected",
                "withdrawn",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;