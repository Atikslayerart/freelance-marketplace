import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../services/adminService";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
    const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminStats();

                setStats(data.data);
            } catch (error) {
                setError(
                    error.message ||
                    "Unable to load dashboard stats."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";

        return "Good evening";
    };

    const metrics = [
        {
            label: "Total Users",
            value: stats?.totalUsers ?? 0,
            path: "/admin/users",
            action: "Manage Users",
        },
        {
            label: "Total Jobs",
            value: stats?.totalJobs ?? 0,
            path: "/admin/jobs",
            action: "Manage Jobs",
        },
        {
            label: "Active Projects",
            value: stats?.activeProjects ?? 0,
            path: "/admin/projects",
            action: "Manage Projects",
        },
        {
            label: "New Messages",
            value: stats?.newContactMessages ?? 0,
            path: "/admin/contact-messages",
            action: "Review Messages",
        },
    ];

    const roleStats = [
        {
            label: "Freelancers",
            value: stats?.totalFreelancers ?? 0,
            color: "bg-indigo-500",
        },
        {
            label: "Clients",
            value: stats?.totalClients ?? 0,
            color: "bg-sky-500",
        },
        {
            label: "Admins",
            value: Math.max(
                (stats?.totalUsers ?? 0) -
                (stats?.totalFreelancers ?? 0) -
                (stats?.totalClients ?? 0),
                0
            ),
            color: "bg-slate-700",
        },
    ];

    const totalRoleUsers =
        roleStats.reduce((total, role) => total + role.value, 0) ||
        1;

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Greeting */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                        Admin Control Center
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {getGreeting()},{" "}
                        {user?.name || "Admin"}
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                        Here’s what’s happening across your
                        FreelanceHub platform today.
                    </p>
                </div>

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="mt-10 text-center text-sm text-slate-500">
                        Loading dashboard...
                    </div>
                ) : (
                    <>
                        {/* Metrics */}
                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {metrics.map((metric) => (
                                <Link
                                    key={metric.label}
                                    to={metric.path}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                                >
                                    <p className="text-sm text-slate-600">
                                        {metric.label}
                                    </p>

                                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                        {metric.value}
                                    </p>

                                    <p className="mt-4 text-xs font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
                                        {metric.action} →
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {/* Insights */}
                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* User distribution */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                                <h2 className="text-base font-semibold text-slate-900">
                                    User Distribution
                                </h2>

                                <p className="mt-1 text-sm text-slate-600">
                                    {stats?.totalUsers ?? 0}{" "}
                                    registered accounts
                                </p>

                                <div className="mt-6 space-y-5">
                                    {roleStats.map((role) => (
                                        <div
                                            key={role.label}
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-slate-700">
                                                    {role.label}
                                                </span>

                                                <span className="font-semibold text-slate-900">
                                                    {role.value}
                                                </span>
                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className={`h-full rounded-full ${role.color}`}
                                                    style={{
                                                        width: `${Math.round(
                                                            (role.value /
                                                                totalRoleUsers) *
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Needs attention */}
                            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Needs Attention
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-600">
                                        Stay on top of incoming
                                        support requests.
                                    </p>

                                    <div className="mt-6 rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs text-slate-500">
                                            New contact
                                            messages
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {stats
                                                ?.newContactMessages ??
                                                0}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to="/admin/contact-messages"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Review Messages
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default AdminDashboard;