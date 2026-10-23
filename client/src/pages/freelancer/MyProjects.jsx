import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getMyProjects,
    updateProjectStatus,
} from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";

function MyProjects() {
    const { user } = useAuth();

    const [projects, setProjects] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updatingProjectId, setUpdatingProjectId] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const data = await getMyProjects(token);

                setProjects(data.projects);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load projects."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleStatusUpdate = async (projectId, status) => {
        setError("");
        setUpdatingProjectId(projectId);

        try {
            const token = localStorage.getItem("authToken");

            const data = await updateProjectStatus(
                projectId,
                status,
                token
            );

            setProjects((previousProjects) =>
                previousProjects.map((project) =>
                    project._id === projectId
                        ? data.project
                        : project
                )
            );
        } catch (updateError) {
            setError(
                updateError.message ||
                "Failed to update project."
            );
        } finally {
            setUpdatingProjectId(null);
        }
    };

    const getStatusStyles = (status) => {
        if (status === "active") {
            return "bg-blue-50 text-blue-700";
        }

        if (status === "submitted") {
            return "bg-amber-50 text-amber-700";
        }

        if (status === "revision") {
            return "bg-orange-50 text-orange-700";
        }

        if (status === "completed") {
            return "bg-green-50 text-green-700";
        }

        if (status === "cancelled") {
            return "bg-red-50 text-red-700";
        }

        return "bg-slate-100 text-slate-700";
    };

    const formatDate = (date) => {
        if (!date) return "No deadline";

        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Projects
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Projects created from accepted proposals.
                    </p>
                </header>

                {error && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="text-slate-600">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            No projects yet
                        </h2>

                        <p className="mt-2 text-slate-600">
                            When a client accepts one of your proposals, the
                            project will appear here.
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {projects.map((project) => (
                            <article
                                key={project._id}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {project.title}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Client:{" "}
                                            {project.client?.name ||
                                                "Client"}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyles(
                                            project.status
                                        )}`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                        Budget: ₹{project.budget}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                        Deadline: {formatDate(project.deadline)}
                                    </span>
                                </div>

                                {project.description && (
                                    <p className="mt-4 line-clamp-3 text-sm text-slate-600">
                                        {project.description}
                                    </p>
                                )}

                                {project.status === "active" && (
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            disabled={
                                                updatingProjectId ===
                                                project._id
                                            }
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    project._id,
                                                    "submitted"
                                                )
                                            }
                                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                        >
                                            {updatingProjectId ===
                                                project._id
                                                ? "Submitting..."
                                                : "Submit Work"}
                                        </button>
                                    </div>
                                )}

                                {project.status === "submitted" && (
                                    <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                        Your work has been submitted. Waiting
                                        for the client to review it.
                                    </p>
                                )}

                                {project.status === "revision" && (
                                    <div className="mt-6 rounded-lg bg-orange-50 p-4">
                                        <p className="text-sm text-orange-700">
                                            The client has requested a revision.
                                        </p>

                                        <button
                                            type="button"
                                            disabled={updatingProjectId === project._id}
                                            onClick={() =>
                                                handleStatusUpdate(project._id, "submitted")
                                            }
                                            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                        >
                                            {updatingProjectId === project._id
                                                ? "Submitting..."
                                                : "Resubmit Work"}
                                        </button>
                                    </div>
                                )}
                                {project.status === "completed" && (
                                    <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                        This project has been completed.
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MyProjects;