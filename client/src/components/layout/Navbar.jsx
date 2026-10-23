import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate("/login");
    };

    const dashboardPath =
        user?.role === "client"
            ? "/client/dashboard"
            : user?.role === "admin"
                ? "/admin/dashboard"
                : "/freelancer/dashboard";

    const profilePath =
        user?.role === "client"
            ? "/client/profile"
            : "/freelancer/profile";

    const publicLinks = [
        { label: "About", path: "/about" },
        { label: "Browse Jobs", path: "/jobs" },
        {
            label: "Find Freelancers",
            path: "/freelancers",
        },
    ];

    return (
        <header
            id="main-navbar"
            className="sticky top-0 z-50 bg-slate-950/95 text-white backdrop-blur"
        >
            {/* Main navbar row */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-xl font-bold tracking-tight"
                >
                    Freelance
                    <span className="text-indigo-400">
                        Hub
                    </span>
                </Link>

                {/* Desktop links */}
                <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
                    {publicLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="transition-colors hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop auth */}
                <div className="hidden items-center gap-2 md:flex">
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                to="/messages"
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                        ? "text-white"
                                        : "text-slate-300 hover:text-white"
                                    }`
                                }
                            >
                                Messages
                            </NavLink>

                            <Link
                                to="/notifications"
                                className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                🔔 Notifications

                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                                        {unreadCount > 9
                                            ? "9+"
                                            : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to={dashboardPath}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to={profilePath}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                Profile
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                Log in
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                            >
                                Join now
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={() =>
                        setIsMenuOpen(!isMenuOpen)
                    }
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    className="rounded-lg p-2 text-slate-200 transition hover:bg-slate-800 md:hidden"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="border-t border-slate-800 bg-slate-950 px-4 pb-5 pt-3 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMenu}
                                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-4 border-t border-slate-800 pt-4">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-1">
                                <Link
                                    to="/messages"
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    Messages
                                </Link>

                                <Link
                                    to="/notifications"
                                    onClick={closeMenu}
                                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    <span>Notifications</span>

                                    {unreadCount > 0 && (
                                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                            {unreadCount > 9
                                                ? "9+"
                                                : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <Link
                                    to={dashboardPath}
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    to={profilePath}
                                    onClick={closeMenu}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    Profile
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-2 rounded-lg border border-slate-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="rounded-lg border border-slate-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Log in
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
                                >
                                    Join now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;