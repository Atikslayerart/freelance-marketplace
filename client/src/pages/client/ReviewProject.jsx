import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createReview } from "../../services/reviewService";

function ReviewProject() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        communication: 5,
        quality: 5,
        timeliness: 5,
        overallRating: 5,
        comment: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: name === "comment" ? value : Number(value),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");

            await createReview(
                projectId,
                {
                    communication: formData.communication,
                    quality: formData.quality,
                    timeliness: formData.timeliness,
                    overallRating: formData.overallRating,
                    comment: formData.comment.trim(),
                },
                token
            );

            navigate("/client/active-projects");
        } catch (reviewError) {
            setError(
                reviewError.message ||
                "Failed to submit review."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-2xl">
                <Link
                    to="/client/active-projects"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to projects
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Rate your experience
                    </h1>

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Communication
                            </span>
                            <select
                                name="communication"
                                value={formData.communication}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} star
                                        {rating === 1 ? "" : "s"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Quality
                            </span>
                            <select
                                name="quality"
                                value={formData.quality}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} star
                                        {rating === 1 ? "" : "s"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Timeliness
                            </span>
                            <select
                                name="timeliness"
                                value={formData.timeliness}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} star
                                        {rating === 1 ? "" : "s"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Overall rating
                            </span>
                            <select
                                name="overallRating"
                                value={formData.overallRating}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} star
                                        {rating === 1 ? "" : "s"}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Write a review
                            </span>
                            <textarea
                                name="comment"
                                rows={5}
                                required
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Describe your experience working with this freelancer."
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Submitting review..."
                                : "Submit Review"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default ReviewProject;