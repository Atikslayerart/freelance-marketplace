import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Footer() {
    const { user, isAuthenticated } = useAuth();

    const publicLinks = [
        {
            label: "Browse Jobs",
            path: "/jobs",
        },
        {
            label: "Find Freelancers",
            path: "/freelancers",
        },
        {
            label: "About",
            path: "/about",
        },
    ];

    const clientLinks = [
        {
            label: "Post a Job",
            path: "/client/post-job",
        },
        {
            label: "My Jobs",
            path: "/client/my-jobs",
        },
        {
            label: "Sent Invitations",
            path: "/client/sent-invitations",
        },
        {
            label: "Active Projects",
            path: "/client/active-projects",
        },
    ];

    const freelancerLinks = [
        {
            label: "My Proposals",
            path: "/freelancer/my-proposals",
        },
        {
            label: "Hire Requests",
            path: "/freelancer/hire-requests",
        },
        {
            label: "My Projects",
            path: "/freelancer/my-projects",
        },
        {
            label: "Messages",
            path: "/messages",
        },
    ];

    const adminLinks = [
        {
            label: "Admin Dashboard",
            path: "/admin/dashboard",
        },
        {
            label: "Manage Users",
            path: "/admin/users",
        },
        {
            label: "Manage Jobs",
            path: "/admin/jobs",
        },
        {
            label: "Reports",
            path: "/admin/reports",
        },
    ];

    const guestLinks = [
        {
            label: "Log in",
            path: "/login",
        },
        {
            label: "Create Account",
            path: "/register",
        },
    ];

    const accountLinks = isAuthenticated
        ? user?.role === "client"
            ? clientLinks
            : user?.role === "freelancer"
                ? freelancerLinks
                : user?.role === "admin"
                    ? adminLinks
                    : []
        : guestLinks;

    const accountTitle = isAuthenticated
        ? user?.role === "client"
            ? "For Clients"
            : user?.role === "freelancer"
                ? "For Freelancers"
                : "Admin"
        : "Account";

    const supportLinks = [
        {
            label: "Help Center",
            path: "/help-center",
        },
        {
            label: "Contact Us",
            path: "/contact",
        },
        {
            label: "Privacy Policy",
            path: "/privacy-policy",
        },
        {
            label: "Terms of Service",
            path: "/terms-of-service",
        },
    ];

    return (
        <footer className="relative z-10 overflow-hidden border-t border-slate-800 bg-slate-950 text-slate-300">
            {/* Subtle footer glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent" />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                {/* Brand */}
                <div>
                    <Link
                        to="/"
                        className="text-xl font-bold text-white"
                    >
                        Freelance
                        <span className="text-indigo-400">
                            Hub
                        </span>
                    </Link>

                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                        Connect, collaborate, and build
                        great things with skilled
                        freelancers worldwide.
                    </p>
                </div>

                {/* Explore */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Explore
                    </h3>

                    <div className="mt-5 flex flex-col gap-3">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm text-slate-400 transition hover:text-indigo-400"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Role-specific links */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        {accountTitle}
                    </h3>

                    <div className="mt-5 flex flex-col gap-3">
                        {accountLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm text-slate-400 transition hover:text-indigo-400"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                        Support
                    </h3>

                    <div className="mt-5 flex flex-col gap-3">
                        {supportLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm text-slate-400 transition hover:text-indigo-400"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative border-t border-slate-800/80 px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
                © {new Date().getFullYear()} FreelanceHub.
                All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;