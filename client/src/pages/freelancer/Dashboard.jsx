import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyProjects } from "../../services/projectService";

function FreelancerDashboard() {
    const { user, logout } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const jobsResponse = await fetch(
                    "http://localhost:5000/api/jobs"
                );

                const jobsData =
                    await jobsResponse.json();

                if (!jobsResponse.ok) {
                    throw new Error(
                        jobsData.message ||
                        "Failed to load jobs."
                    );
                }

                setJobs(
                    jobsData.jobs.slice(0, 4)
                );

                const token =
                    localStorage.getItem(
                        "authToken"
                    );

                const projectsData =
                    await getMyProjects(token);

                setProjects(
                    projectsData.projects
                );
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load dashboard data."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const activeProjects = projects.filter(
        (project) =>
            project.status === "active"
    );

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-8 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome,{" "}
                            {user?.name}
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Find jobs, manage
                            proposals, and grow
                            your freelance
                            career.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/freelancer/hire-requests"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Hire Requests
                        </Link>

                        <Link
                            to="/freelancer/profile"
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                        >
                            My Profile
                        </Link>

                        <button
                            onClick={logout}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Log out
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Browse Jobs
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Explore open jobs
                            posted by clients.
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Browse Jobs
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            My Proposals
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Track proposals you
                            have submitted.
                        </p>

                        <Link
                            to="/freelancer/my-proposals"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            View My Proposals
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Hire Requests
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            View and respond to
                            invitations from
                            clients.
                        </p>

                        <Link
                            to="/freelancer/hire-requests"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            View Hire Requests
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Active Projects
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            {
                                activeProjects.length
                            }{" "}
                            active project
                            {activeProjects.length ===
                                1
                                ? ""
                                : "s"}
                        </p>

                        <Link
                            to="/freelancer/my-projects"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            View My Projects
                        </Link>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Latest open jobs
                        </h2>

                        <Link
                            to="/jobs"
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                        >
                            View all jobs
                        </Link>
                    </div>

                    {isLoading ? (
                        <p className="mt-6 text-slate-600">
                            Loading latest
                            jobs...
                        </p>
                    ) : jobs.length === 0 ? (
                        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">
                                No open jobs yet
                            </h3>

                            <p className="mt-2 text-slate-600">
                                When clients post
                                jobs, they will
                                appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            {jobs.map(
                                (job) => (
                                    <article
                                        key={
                                            job._id
                                        }
                                        className="rounded-2xl bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {
                                                    job.title
                                                }
                                            </h3>

                                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                                {
                                                    job.status
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                            {
                                                job.description
                                            }
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                                {
                                                    job.category
                                                }
                                            </span>

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                                ₹
                                                {
                                                    job.budgetAmount
                                                }
                                            </span>

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                                {
                                                    job.experienceLevel
                                                }
                                            </span>
                                        </div>

                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                        >
                                            View Job
                                        </Link>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default FreelancerDashboard;