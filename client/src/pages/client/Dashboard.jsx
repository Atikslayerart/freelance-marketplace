import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ClientDashboard() {
    const { user, logout } = useAuth();

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
                            Manage your jobs,
                            proposals, and
                            projects.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/client/sent-invitations"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Sent Invitations
                        </Link>

                        <Link
                            to="/client/profile"
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

                <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Post a Job
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Create a new job and
                            find the right
                            freelancer.
                        </p>

                        <Link
                            to="/client/post-job"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Post Job
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            My Jobs
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Review jobs you have
                            posted and manage
                            proposals.
                        </p>

                        <Link
                            to="/client/my-jobs"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            View My Jobs
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Sent Invitations
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Track freelancers you
                            have invited to your
                            jobs.
                        </p>

                        <Link
                            to="/client/sent-invitations"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            View Invitations
                        </Link>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Active Projects
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Track work currently
                            in progress.
                        </p>

                        <Link
                            to="/client/active-projects"
                            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            View Active Projects
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ClientDashboard;