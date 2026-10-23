import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
        },
        {
            label: "Manage Users",
            path: "/admin/users",
        },
        {
            label: "Contact Messages",
            path: "/admin/contact-messages",
        },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="hidden w-72 flex-col justify-between border-r border-slate-200 bg-white p-6 md:flex">
                <div>
                    <Link
                        to="/admin/dashboard"
                        className="text-xl font-bold tracking-tight text-slate-900"
                    >
                        Freelance
                        <span className="text-indigo-600">
                            Hub
                        </span>
                    </Link>

                    <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                        Admin Panel
                    </p>

                    <nav className="mt-10 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Log out
                </button>
            </aside>

            {/* Main area */}
            <div className="flex min-h-screen flex-1 flex-col">
                <div className="flex-1">
                    <Outlet />
                </div>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Freelance
                                <span className="text-indigo-600">
                                    Hub
                                </span>{" "}
                                <span className="font-normal text-slate-500">
                                    Admin
                                </span>
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                © {new Date().getFullYear()}{" "}
                                FreelanceHub. All rights
                                reserved.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            <Link
                                to="/admin/dashboard"
                                className="transition hover:text-indigo-600"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/admin/users"
                                className="transition hover:text-indigo-600"
                            >
                                Users
                            </Link>

                            <Link
                                to="/admin/contact-messages"
                                className="transition hover:text-indigo-600"
                            >
                                Messages
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default AdminLayout;