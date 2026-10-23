import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/jobs/my-jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "authToken"
                            )}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load jobs.");
                }

                setJobs(data.jobs);
            } catch (fetchError) {
                setError(
                    fetchError.message || "Failed to load jobs."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyJobs();
    }, []);

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Jobs
                    </h1>

                    <Link
                        to="/client/post-job"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        + Post Job
                    </Link>
                </div>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="mt-6 text-slate-600">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No jobs posted yet
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Post your first job to start receiving proposals.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {jobs.map((job) => (
                            <article
                                key={job._id}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {job.title}
                                </h2>

                                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                    {job.description}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                        {job.category}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                        ₹{job.budgetAmount}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                        {job.status}
                                    </span>

                                    <Link
                                        to={`/client/jobs/${job._id}/proposals`}
                                        className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        View Proposals
                                    </Link>

                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MyJobs;