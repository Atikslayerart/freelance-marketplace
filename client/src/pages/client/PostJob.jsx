import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobService";

function PostJob() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Web Development",
        skills: "",
        budgetType: "fixed",
        budgetAmount: "",
        experienceLevel: "beginner",
        deadline: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");

            const response = await createJob(
                {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    category: formData.category,
                    skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                    budgetType: formData.budgetType,
                    budgetAmount: Number(formData.budgetAmount),
                    experienceLevel: formData.experienceLevel,
                    deadline: formData.deadline,
                },
                token
            );

            setSuccess(response.message);

            navigate("/client/my-jobs");
        } catch (jobError) {
            setError(
                jobError.message ||
                "Failed to post job. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-2xl">
                <Link
                    to="/client/dashboard"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200"
                >
                    ← Back
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Post a Job
                    </h1>

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Job title
                            </span>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="React Developer Needed"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Job description
                            </span>
                            <textarea
                                name="description"
                                rows={6}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the work, requirements, and deliverables."
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Category
                            </span>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                <option value="Web Development">
                                    Web Development
                                </option>
                                <option value="Design">Design</option>
                                <option value="Mobile Apps">
                                    Mobile Apps
                                </option>
                                <option value="Writing">Writing</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Video & Animation">
                                    Video & Animation
                                </option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Required skills
                            </span>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Budget type
                                </span>
                                <select
                                    name="budgetType"
                                    required
                                    value={formData.budgetType}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    <option value="fixed">Fixed price</option>
                                    <option value="hourly">Hourly</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Budget amount (₹)
                                </span>
                                <input
                                    type="number"
                                    name="budgetAmount"
                                    min="1"
                                    required
                                    value={formData.budgetAmount}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Experience level
                            </span>
                            <select
                                name="experienceLevel"
                                required
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                    Intermediate
                                </option>
                                <option value="expert">Expert</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Deadline
                            </span>
                            <input
                                type="date"
                                name="deadline"
                                required
                                value={formData.deadline}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Posting job..." : "Post Job"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default PostJob;