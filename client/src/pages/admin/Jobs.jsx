import { useEffect, useState } from "react";
import {
    getAdminJobs,
    updateJobStatus,
    deleteJob,
} from "../../services/adminService";

const statusOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "closed", label: "Closed" },
];

const statusStyles = {
    open: "bg-green-50 text-green-700 border-green-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    closed: "bg-slate-100 text-slate-600 border-slate-300",
};

function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminJobs({
                search,
                status,
                page,
                limit: 10,
            });

            setJobs(data.data);
            setPagination(data.pagination);
        } catch (error) {
            setError(
                error.message ||
                "Unable to load jobs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [status, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchJobs();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);

            await updateJobStatus(id, newStatus);

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job._id === id
                        ? { ...job, status: newStatus }
                        : job
                )
            );

            if (
                selectedJob &&
                selectedJob._id === id
            ) {
                setSelectedJob({
                    ...selectedJob,
                    status: newStatus,
                });
            }
        } catch (error) {
            setError(
                error.message ||
                "Unable to update job status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteJob = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            setUpdatingId(id);

            await deleteJob(id);

            setJobs((prevJobs) =>
                prevJobs.filter((job) => job._id !== id)
            );

            if (selectedJob?._id === id) {
                setSelectedJob(null);
            }
        } catch (error) {
            setError(
                error.message ||
                "Unable to delete job."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Manage Jobs
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Review, moderate, and manage all
                            jobs posted on FreelanceHub.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search jobs by title..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
                    />
                </div>

                {/* Filters */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setStatus(option.value);
                                setPage(1);
                            }}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${status === option.value
                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="mt-10 text-center text-sm text-slate-500">
                        Loading jobs...
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No jobs found
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            There are no jobs matching your
                            filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Jobs list */}
                        <div className="mt-6 space-y-4">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-base font-semibold text-slate-900">
                                                    {job.title}
                                                </h2>

                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[
                                                        job.status
                                                        ]
                                                        }`}
                                                >
                                                    {job.status.replace(
                                                        "-",
                                                        " "
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                                                {job.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                                <span>
                                                    Budget: ₹
                                                    {job.budgetAmount}
                                                </span>

                                                <span>
                                                    Posted by:{" "}
                                                    {job.client
                                                        ?.name ||
                                                        "Unknown"}
                                                </span>

                                                <span>
                                                    {new Date(
                                                        job.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedJob(
                                                        job
                                                    )
                                                }
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                                            >
                                                View
                                            </button>

                                            {job.status ===
                                                "closed" ? (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        job._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            job._id,
                                                            "open"
                                                        )
                                                    }
                                                    className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                                                >
                                                    Reopen
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        job._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            job._id,
                                                            "closed"
                                                        )
                                                    }
                                                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                                                >
                                                    Close
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                disabled={
                                                    updatingId ===
                                                    job._id
                                                }
                                                onClick={() =>
                                                    handleDeleteJob(
                                                        job._id
                                                    )
                                                }
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination &&
                            pagination.totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between">
                                    <button
                                        onClick={() =>
                                            setPage(
                                                (prev) => prev - 1
                                            )
                                        }
                                        disabled={
                                            !pagination.hasPrevPage
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    <p className="text-sm text-slate-600">
                                        Page{" "}
                                        {pagination.currentPage} of{" "}
                                        {pagination.totalPages}
                                    </p>

                                    <button
                                        onClick={() =>
                                            setPage(
                                                (prev) => prev + 1
                                            )
                                        }
                                        disabled={
                                            !pagination.hasNextPage
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                    </>
                )}
            </div>

            {/* Job details modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {selectedJob.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    Posted by{" "}
                                    {selectedJob.client?.name ||
                                        "Unknown"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedJob(null)
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                    {selectedJob.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Budget
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        ₹
                                        {selectedJob.budgetAmount}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Budget Type
                                    </p>

                                    <p className="mt-1 font-semibold capitalize text-slate-900">
                                        {selectedJob.budgetType}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Experience Level
                                    </p>

                                    <p className="mt-1 font-semibold capitalize text-slate-900">
                                        {selectedJob.experienceLevel}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Deadline
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        {new Date(
                                            selectedJob.deadline
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Status
                                    </p>

                                    <p className="mt-1 font-semibold capitalize text-slate-900">
                                        {selectedJob.status.replace(
                                            "-",
                                            " "
                                        )}
                                    </p>
                                </div>
                            </div>

                            {selectedJob.skills?.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Skills
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedJob.skills.map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedJob(null)
                                }
                                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminJobs;