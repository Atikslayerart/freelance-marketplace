import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobById } from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";

function JobDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(id);

                setJob(data.job);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load job details."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "";

        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <p className="text-slate-600">Loading job details...</p>
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
                        to="/jobs"
                        className="mt-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                        ← Back to jobs
                    </Link>
                </div>
            </main>
        );
    }

    if (!job) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                        <h1 className="text-xl font-semibold text-slate-900">
                            Job not found
                        </h1>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/jobs"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to jobs
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                {job.title}
                            </h1>

                            <p className="mt-2 text-slate-600">
                                Posted by{" "}
                                <span className="font-medium text-slate-800">
                                    {job.client?.name || "Client"}
                                </span>
                            </p>
                        </div>

                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                            {job.status}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Category</p>

                            <p className="mt-1 font-medium text-slate-900">
                                {job.category}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Budget</p>

                            <p className="mt-1 font-medium text-slate-900">
                                {job.budgetType === "fixed"
                                    ? `₹${job.budgetAmount} fixed price`
                                    : `₹${job.budgetAmount} per hour`}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">
                                Experience level
                            </p>

                            <p className="mt-1 font-medium text-slate-900">
                                {job.experienceLevel}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">Deadline</p>

                            <p className="mt-1 font-medium text-slate-900">
                                {formatDate(job.deadline)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Job description
                        </h2>

                        <p className="mt-2 whitespace-pre-line text-slate-600">
                            {job.description}
                        </p>
                    </div>

                    {job.skills?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Required skills
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-10 border-t border-slate-100 pt-6">
                        {user?.role === "freelancer" ? (
                            <Link
                                to={`/freelancer/apply-job/${job._id}`}
                                className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
                            >
                                Apply Now
                            </Link>
                        ) : user?.role === "client" ? (
                            <p className="text-sm text-slate-600">
                                You are viewing this job as a client.
                            </p>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
                            >
                                Login to apply
                            </Link>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default JobDetails;