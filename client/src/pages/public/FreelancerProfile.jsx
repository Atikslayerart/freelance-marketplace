import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUserReviews } from "../../services/reviewService";
import { getMyJobs } from "../../services/jobService";
import { createHireRequest } from "../../services/hireRequestService";
import { useAuth } from "../../context/AuthContext";

function FreelancerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [profileUser, setProfileUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [showHireModal, setShowHireModal] = useState(false);
    const [myJobs, setMyJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [hireMessage, setHireMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [hireError, setHireError] = useState("");
    const [hireSuccess, setHireSuccess] = useState("");

    const isOwnProfile = user?._id === id;
    const isClient = user?.role === "client";

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userResponse = await fetch(
                    `http://localhost:5000/api/users/${id}`
                );

                const userData =
                    await userResponse.json();

                if (!userResponse.ok) {
                    throw new Error(
                        userData.message ||
                        "Failed to load freelancer."
                    );
                }

                setProfileUser(userData.user);

                const reviewData =
                    await getUserReviews(id);

                setReviews(
                    reviewData.reviews || []
                );
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load profile."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "";

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        ).format(new Date(date));
    };

    const handleContact = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        navigate(`/messages/${id}`);
    };

    const openHireModal = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "client") {
            setHireError(
                "Only clients can send hire invitations."
            );
            return;
        }

        setShowHireModal(true);
        setHireError("");
        setHireSuccess("");

        try {
            const data = await getMyJobs();

            setMyJobs(data.jobs || data);
        } catch (error) {
            setHireError(
                error.message ||
                "Failed to load your jobs."
            );
        }
    };

    const closeHireModal = () => {
        setShowHireModal(false);
        setSelectedJobId("");
        setHireMessage("");
        setHireError("");
        setHireSuccess("");
    };

    const handleHire = async () => {
        if (!selectedJobId) {
            setHireError(
                "Please select a job."
            );
            return;
        }

        setIsSending(true);
        setHireError("");

        try {
            await createHireRequest({
                freelancerId: profileUser._id,
                jobId: selectedJobId,
                message: hireMessage,
            });

            setHireSuccess(
                "Hire invitation sent successfully."
            );

            setSelectedJobId("");
            setHireMessage("");

            setTimeout(() => {
                closeHireModal();
            }, 1500);
        } catch (error) {
            setHireError(
                error.message ||
                "Failed to send hire invitation."
            );
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <p className="text-slate-600">
                        Loading freelancer
                        profile...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>

                    <Link
                        to="/freelancers"
                        className="mt-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                        ← Back to freelancers
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/freelancers"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to freelancers
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                {profileUser?.name?.charAt(
                                    0
                                ) || "F"}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {
                                        profileUser?.name
                                    }
                                </h1>

                                <p className="text-slate-600">
                                    {profileUser?.bio ||
                                        "No bio added yet."}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    ⭐{" "}
                                    {profileUser?.rating ||
                                        0}{" "}
                                    •{" "}
                                    {profileUser?.totalReviews ||
                                        0}{" "}
                                    reviews
                                </p>

                                {profileUser?.location && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        📍{" "}
                                        {
                                            profileUser.location
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        {!isOwnProfile &&
                            isClient && (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={
                                            handleContact
                                        }
                                        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                                    >
                                        Contact
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            openHireModal
                                        }
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Hire
                                    </button>
                                </div>
                            )}
                    </div>

                    {profileUser?.skills?.length >
                        0 && (
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Skills
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {profileUser.skills.map(
                                        (skill) => (
                                            <span
                                                key={
                                                    skill
                                                }
                                                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                            >
                                                {
                                                    skill
                                                }
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {profileUser?.hourlyRate && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Hourly rate
                            </h2>

                            <p className="mt-2 text-slate-600">
                                ₹
                                {
                                    profileUser.hourlyRate
                                }
                                /hour
                            </p>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Portfolio
                        </h2>

                        {profileUser?.portfolio
                            ?.length ? (
                            <div className="mt-4 grid gap-5 sm:grid-cols-2">
                                {profileUser.portfolio.map(
                                    (
                                        project
                                    ) => (
                                        <article
                                            key={
                                                project._id
                                            }
                                            className="overflow-hidden rounded-2xl border border-slate-200"
                                        >
                                            {project.imageUrl ? (
                                                <img
                                                    src={
                                                        project.imageUrl
                                                    }
                                                    alt={
                                                        project.title
                                                    }
                                                    className="h-44 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-500">
                                                    No
                                                    image
                                                </div>
                                            )}

                                            <div className="p-5">
                                                <h3 className="font-semibold text-slate-900">
                                                    {
                                                        project.title
                                                    }
                                                </h3>

                                                {project.description && (
                                                    <p className="mt-2 text-sm text-slate-600">
                                                        {
                                                            project.description
                                                        }
                                                    </p>
                                                )}

                                                {project.projectUrl && (
                                                    <a
                                                        href={
                                                            project.projectUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                    >
                                                        View
                                                        project
                                                        →
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-slate-600">
                                No portfolio
                                projects added
                                yet.
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Reviews
                        </h2>

                        {reviews.length === 0 ? (
                            <p className="mt-2 text-sm text-slate-600">
                                No reviews yet.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-4">
                                {reviews.map(
                                    (review) => (
                                        <article
                                            key={
                                                review._id
                                            }
                                            className="rounded-2xl border border-slate-200 p-5"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">
                                                        {review
                                                            .reviewer
                                                            ?.name ||
                                                            "Client"}
                                                    </h3>

                                                    <p className="text-sm text-slate-500">
                                                        {formatDate(
                                                            review.createdAt
                                                        )}
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                                                    ⭐{" "}
                                                    {
                                                        review.overallRating
                                                    }
                                                    /5
                                                </span>
                                            </div>

                                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                                <p className="text-sm text-slate-600">
                                                    Communication:{" "}
                                                    {
                                                        review.communication
                                                    }
                                                    /5
                                                </p>

                                                <p className="text-sm text-slate-600">
                                                    Quality:{" "}
                                                    {
                                                        review.quality
                                                    }
                                                    /5
                                                </p>

                                                <p className="text-sm text-slate-600">
                                                    Timeliness:{" "}
                                                    {
                                                        review.timeliness
                                                    }
                                                    /5
                                                </p>
                                            </div>

                                            <p className="mt-3 text-slate-600">
                                                {
                                                    review.comment
                                                }
                                            </p>

                                            {review
                                                .project
                                                ?.title && (
                                                    <p className="mt-3 text-sm text-slate-500">
                                                        Project:{" "}
                                                        {
                                                            review
                                                                .project
                                                                .title
                                                        }
                                                    </p>
                                                )}
                                        </article>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {showHireModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-slate-900">
                            Hire{" "}
                            {profileUser?.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                            Select one of your
                            posted jobs and send
                            an invitation.
                        </p>

                        {hireError && (
                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {hireError}
                            </div>
                        )}

                        {hireSuccess && (
                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                {hireSuccess}
                            </div>
                        )}

                        <div className="mt-5">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Select Job
                            </label>

                            <select
                                value={
                                    selectedJobId
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedJobId(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="">
                                    Choose a job
                                </option>

                                {myJobs.map(
                                    (job) => (
                                        <option
                                            key={
                                                job._id
                                            }
                                            value={
                                                job._id
                                            }
                                        >
                                            {
                                                job.title
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Message
                            </label>

                            <textarea
                                value={
                                    hireMessage
                                }
                                onChange={(
                                    event
                                ) =>
                                    setHireMessage(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                rows={4}
                                placeholder="Explain why this job is a good fit for the freelancer."
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={
                                    closeHireModal
                                }
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleHire
                                }
                                disabled={
                                    isSending
                                }
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {isSending
                                    ? "Sending..."
                                    : "Send Invitation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default FreelancerProfile;