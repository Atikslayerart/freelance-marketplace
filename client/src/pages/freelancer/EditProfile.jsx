import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function EditProfile() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
        location: user?.location || "",
        skills: user?.skills?.join(", ") || "",
        hourlyRate: user?.hourlyRate || "",
    });

    const [portfolio, setPortfolio] = useState(
        user?.portfolio?.length
            ? user.portfolio
            : [
                {
                    title: "",
                    description: "",
                    imageUrl: "",
                    projectUrl: "",
                },
            ]
    );

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

    const handlePortfolioChange = (index, event) => {
        const { name, value } = event.target;

        setPortfolio((previousPortfolio) =>
            previousPortfolio.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        [name]: value,
                    }
                    : item
            )
        );
    };

    const addPortfolioItem = () => {
        setPortfolio((previousPortfolio) => [
            ...previousPortfolio,
            {
                title: "",
                description: "",
                imageUrl: "",
                projectUrl: "",
            },
        ]);
    };

    const removePortfolioItem = (index) => {
        setPortfolio((previousPortfolio) =>
            previousPortfolio.filter((item, itemIndex) => itemIndex !== index)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const cleanedPortfolio = portfolio
                .filter((item) => item.title.trim() !== "")
                .map((item) => ({
                    title: item.title.trim(),
                    description: item.description.trim(),
                    imageUrl: item.imageUrl.trim(),
                    projectUrl: item.projectUrl.trim(),
                }));

            const response = await fetch(
                "http://localhost:5000/api/users/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        bio: formData.bio.trim(),
                        location: formData.location.trim(),
                        skills: formData.skills
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean),
                        hourlyRate: Number(formData.hourlyRate),
                        portfolio: cleanedPortfolio,
                    }),
                }
            );

            const contentType = response.headers.get("content-type");

            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(
                    "Profile update endpoint is not available. Check the backend route."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update profile."
                );
            }

            updateUser(data.user);

            setSuccess("Profile updated successfully.");
            navigate("/freelancer/profile");
        } catch (updateError) {
            setError(
                updateError.message ||
                "Failed to update profile. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-2xl">
                <Link
                    to="/freelancer/profile"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200"
                >
                    ← Back
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Edit Profile
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

                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Basic information
                            </h2>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Full name
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    About me
                                </span>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Location
                                </span>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Skills
                                </span>
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="React, Node.js, MongoDB"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">
                                    Hourly rate (₹)
                                </span>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    min="0"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>
                        </div>

                        <div className="space-y-4 border-t border-slate-200 pt-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Portfolio
                                </h2>

                                <button
                                    type="button"
                                    onClick={addPortfolioItem}
                                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                                >
                                    + Add project
                                </button>
                            </div>

                            {portfolio.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-slate-700">
                                            Project {index + 1}
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePortfolioItem(index)
                                            }
                                            className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">
                                            Project title
                                        </span>
                                        <input
                                            type="text"
                                            name="title"
                                            value={item.title}
                                            onChange={(event) =>
                                                handlePortfolioChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            placeholder="E-commerce Dashboard"
                                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                        />
                                    </label>

                                    <label className="mt-3 block">
                                        <span className="text-sm font-medium text-slate-700">
                                            Description
                                        </span>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            value={item.description}
                                            onChange={(event) =>
                                                handlePortfolioChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            placeholder="Describe what you built and the technologies used."
                                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                        />
                                    </label>

                                    <label className="mt-3 block">
                                        <span className="text-sm font-medium text-slate-700">
                                            Image URL
                                        </span>
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            value={item.imageUrl}
                                            onChange={(event) =>
                                                handlePortfolioChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            placeholder="https://example.com/project-image.png"
                                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                        />
                                    </label>

                                    <label className="mt-3 block">
                                        <span className="text-sm font-medium text-slate-700">
                                            Project URL
                                        </span>
                                        <input
                                            type="url"
                                            name="projectUrl"
                                            value={item.projectUrl}
                                            onChange={(event) =>
                                                handlePortfolioChange(
                                                    index,
                                                    event
                                                )
                                            }
                                            placeholder="https://github.com/username/project"
                                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Saving changes..."
                                : "Save changes"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default EditProfile;