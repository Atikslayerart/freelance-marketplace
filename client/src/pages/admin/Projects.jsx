import { useEffect, useState } from "react";
import {
    getAdminProjects,
    updateProjectStatus,
    deleteProject,
} from "../../services/adminService";

const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const statusStyles = {
    active: "bg-green-50 text-green-700 border-green-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
};

function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminProjects({
                search,
                status,
                page,
                limit: 10,
            });

            setProjects(data.data);
            setPagination(data.pagination);
        } catch (error) {
            setError(
                error.message ||
                "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [status, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchProjects();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);

            await updateProjectStatus(id, newStatus);

            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === id
                        ? { ...project, status: newStatus }
                        : project
                )
            );

            if (
                selectedProject &&
                selectedProject._id === id
            ) {
                setSelectedProject({
                    ...selectedProject,
                    status: newStatus,
                });
            }
        } catch (error) {
            setError(
                error.message ||
                "Unable to update project status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteProject = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            setUpdatingId(id);

            await deleteProject(id);

            setProjects((prevProjects) =>
                prevProjects.filter(
                    (project) => project._id !== id
                )
            );

            if (selectedProject?._id === id) {
                setSelectedProject(null);
            }
        } catch (error) {
            setError(
                error.message ||
                "Unable to delete project."
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
                            Manage Projects
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Monitor and moderate all projects
                            on FreelanceHub.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search projects by title..."
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
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No projects found
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            There are no projects matching
                            your filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Projects list */}
                        <div className="mt-6 space-y-4">
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-base font-semibold text-slate-900">
                                                    {project.title}
                                                </h2>

                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[
                                                        project.status
                                                        ] ||
                                                        "bg-slate-100 text-slate-600 border-slate-300"
                                                        }`}
                                                >
                                                    {project.status.replace(
                                                        "-",
                                                        " "
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                                                {project.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                                <span>
                                                    Client:{" "}
                                                    {project.client
                                                        ?.name ||
                                                        "Unknown"}
                                                </span>

                                                <span>
                                                    Freelancer:{" "}
                                                    {project.freelancer
                                                        ?.name ||
                                                        "Unassigned"}
                                                </span>

                                                <span>
                                                    Budget: ₹
                                                    {project.budgetAmount ??
                                                        project.budget ??
                                                        "N/A"}
                                                </span>

                                                <span>
                                                    {new Date(
                                                        project.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedProject(
                                                        project
                                                    )
                                                }
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                                            >
                                                View
                                            </button>

                                            {project.status !==
                                                "cancelled" ? (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        project._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            project._id,
                                                            "cancelled"
                                                        )
                                                    }
                                                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        project._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            project._id,
                                                            "active"
                                                        )
                                                    }
                                                    className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                                                >
                                                    Restore
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                disabled={
                                                    updatingId ===
                                                    project._id
                                                }
                                                onClick={() =>
                                                    handleDeleteProject(
                                                        project._id
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

            {/* Project details modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {selectedProject.title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    Client:{" "}
                                    {selectedProject.client
                                        ?.name || "Unknown"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedProject(null)
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
                                    {selectedProject.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Freelancer
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        {selectedProject
                                            .freelancer?.name ||
                                            "Unassigned"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Budget
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        ₹
                                        {selectedProject.budgetAmount ??
                                            selectedProject.budget ??
                                            "N/A"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Status
                                    </p>

                                    <p className="mt-1 font-semibold capitalize text-slate-900">
                                        {selectedProject.status.replace(
                                            "-",
                                            " "
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Started
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-900">
                                        {new Date(
                                            selectedProject.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedProject(null)
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

export default AdminProjects;