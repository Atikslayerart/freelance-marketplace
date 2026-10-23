import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function FreelancerProfile() {
    const { user } = useAuth();

    return (
        <main className="bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/freelancer/dashboard"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200"
                >
                    ← Back
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                {user?.name?.charAt(0) || "U"}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {user?.name}
                                </h1>

                                <p className="text-slate-600">
                                    {user?.bio ||
                                        "Add a short professional bio."}
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/freelancer/edit-profile"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Skills
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {user?.skills?.length ? (
                                user.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="mt-2 text-sm text-slate-600">
                                    No skills added yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Portfolio
                        </h2>

                        {user?.portfolio?.length ? (
                            <div className="mt-4 grid gap-5 sm:grid-cols-2">
                                {user.portfolio.map((project) => (
                                    <article
                                        key={project._id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="h-44 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-500">
                                                No project image
                                            </div>
                                        )}

                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {project.title}
                                            </h3>

                                            {project.description && (
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {project.description}
                                                </p>
                                            )}

                                            {project.projectUrl && (
                                                <a
                                                    href={project.projectUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 inline-block rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                                                >
                                                    View project →
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-slate-600">
                                No portfolio projects added yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default FreelancerProfile;