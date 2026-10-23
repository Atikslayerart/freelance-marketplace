import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project is required"],
        },

        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reviewer is required"],
        },

        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reviewee is required"],
        },

        communication: {
            type: Number,
            required: [true, "Communication rating is required"],
            min: [1, "Communication rating must be between 1 and 5"],
            max: [5, "Communication rating must be between 1 and 5"],
        },

        quality: {
            type: Number,
            required: [true, "Quality rating is required"],
            min: [1, "Quality rating must be between 1 and 5"],
            max: [5, "Quality rating must be between 1 and 5"],
        },

        timeliness: {
            type: Number,
            required: [true, "Timeliness rating is required"],
            min: [1, "Timeliness rating must be between 1 and 5"],
            max: [5, "Timeliness rating must be between 1 and 5"],
        },

        overallRating: {
            type: Number,
            required: [true, "Overall rating is required"],
            min: [1, "Overall rating must be between 1 and 5"],
            max: [5, "Overall rating must be between 1 and 5"],
        },

        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
            minlength: [10, "Review comment must be at least 10 characters"],
            maxlength: [
                1000,
                "Review comment cannot exceed 1000 characters",
            ],
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;