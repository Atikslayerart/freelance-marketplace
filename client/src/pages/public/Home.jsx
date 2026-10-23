import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const categories = [
    {
        name: "Web Development",
        icon: "💻",
        path: "/jobs?category=web-development",
    },
    {
        name: "Mobile Development",
        icon: "📱",
        path: "/jobs?category=mobile-development",
    },
    {
        name: "Design",
        icon: "🎨",
        path: "/jobs?category=design",
    },
    {
        name: "Writing",
        icon: "✍️",
        path: "/jobs?category=writing",
    },
    {
        name: "Marketing",
        icon: "📈",
        path: "/jobs?category=marketing",
    },
    {
        name: "Data Entry",
        icon: "🗂️",
        path: "/jobs?category=data-entry",
    },
];

const popularSkills = [
    "Web Development",
    "UI/UX",
    "Graphic Design",
    "Content Writing",
];

const quickLinks = [
    {
        label: "💻 Web Development",
        path: "/jobs?category=web-development",
    },
    {
        label: "📱 Mobile Development",
        path: "/jobs?category=mobile-development",
    },
    {
        label: "🎨 Design",
        path: "/jobs?category=design",
    },
    {
        label: "✍️ Writing",
        path: "/jobs?category=writing",
    },
    {
        label: "📈 Marketing",
        path: "/jobs?category=marketing",
    },
    {
        label: "🗂️ Data Entry",
        path: "/jobs?category=data-entry",
    },
];

const featuredFreelancers = [
    {
        id: 1,
        name: "Md Atik",
        title: "Full Stack Developer",
        rating: 4.9,
        reviews: 32,
        skills: ["React", "Node.js", "MongoDB"],
        startingAt: 2500,
    },
    {
        id: 2,
        name: "Sara Khan",
        title: "UI/UX Designer",
        rating: 4.8,
        reviews: 27,
        skills: ["Figma", "Adobe XD", "Prototyping"],
        startingAt: 1800,
    },
    {
        id: 3,
        name: "Rahul Verma",
        title: "Content Writer",
        rating: 4.7,
        reviews: 19,
        skills: ["SEO", "Blogging", "Copywriting"],
        startingAt: 900,
    },
];

function Home() {
    const { user, isAuthenticated } = useAuth();

    const quickNavRef = useRef(null);
    const [isQuickNavSticky, setIsQuickNavSticky] =
        useState(false);
    const [navbarHeight, setNavbarHeight] =
        useState(64);

    useEffect(() => {
        const navbar = document.getElementById(
            "main-navbar"
        );

        const handleScroll = () => {
            if (!quickNavRef.current || !navbar) {
                return;
            }

            const height = navbar.offsetHeight;

            setNavbarHeight(height);

            const rect =
                quickNavRef.current.getBoundingClientRect();

            setIsQuickNavSticky(
                rect.top <= height
            );
        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            handleScroll,
            { passive: true }
        );

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );

            window.removeEventListener(
                "resize",
                handleScroll
            );
        };
    }, []);

    return (
        <main className="w-full overflow-x-hidden bg-slate-950">
            {/* Hero */}
            <section className="relative -mt-16 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
                    alt="Professionals collaborating in a modern office"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-indigo-950/85 to-slate-900/75" />

                <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 text-white sm:px-6 sm:pb-24 sm:pt-40 lg:px-8 lg:pb-32 lg:pt-48">
                    <div className="fade-in mx-auto max-w-3xl text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300 sm:text-sm">
                            Freelance Marketplace
                        </p>

                        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                            Find the right talent.
                            <br className="hidden sm:block" />{" "}
                            Build something great.
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-lg">
                            Connect with skilled freelancers and
                            turn your ideas into reality.
                        </p>

                        {/* Search */}
                        <div className="mx-auto mt-7 flex w-full max-w-xl flex-col gap-2 rounded-xl bg-white/10 p-2 backdrop-blur sm:flex-row sm:items-center">
                            <input
                                type="text"
                                placeholder="Search for services, skills or jobs..."
                                className="w-full rounded-lg bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-300 focus:outline-none"
                            />

                            <Link
                                to="/jobs"
                                className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                            >
                                Search
                            </Link>
                        </div>
                    </div>

                    {/* Quick navigation cards */}
                    <div
                        ref={quickNavRef}
                        className="mx-auto mt-8 w-full max-w-7xl"
                    >
                        <div className="no-scrollbar flex flex-nowrap items-center justify-center gap-2 overflow-x-auto sm:gap-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="shrink-0 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur transition hover:border-indigo-500 hover:bg-slate-800 hover:text-white sm:px-4 sm:text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Hero buttons */}
                    <div className="fade-in mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-3 text-center sm:flex-row">
                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/register"
                                    className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                >
                                    Create Account
                                </Link>

                                <Link
                                    to="/jobs"
                                    className="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                                >
                                    Browse Jobs
                                </Link>
                            </>
                        )}

                        {isAuthenticated &&
                            user?.role === "client" && (
                                <>
                                    <Link
                                        to="/client/post-job"
                                        className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                    >
                                        Post a Job
                                    </Link>

                                    <Link
                                        to="/client/my-jobs"
                                        className="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                                    >
                                        My Jobs
                                    </Link>
                                </>
                            )}

                        {isAuthenticated &&
                            user?.role === "freelancer" && (
                                <>
                                    <Link
                                        to="/jobs"
                                        className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                    >
                                        Browse Jobs
                                    </Link>

                                    <Link
                                        to="/freelancer/my-proposals"
                                        className="w-full rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                                    >
                                        My Proposals
                                    </Link>
                                </>
                            )}

                        {isAuthenticated &&
                            user?.role === "admin" && (
                                <Link
                                    to="/admin/dashboard"
                                    className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                    </div>
                </div>
            </section>

            {/* Sticky merged quick navigation */}
            <div
                className={`fixed inset-x-0 top-0 z-40 bg-slate-950 transition-all duration-300 ease-out ${isQuickNavSticky
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0 pointer-events-none"
                    }`}
                style={{
                    paddingTop: `${navbarHeight}px`,
                }}
            >
                <div className="no-scrollbar mx-auto flex max-w-7xl items-center justify-center gap-2 overflow-x-auto px-4 pb-2.5 sm:gap-3 sm:px-6 lg:px-8">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="shrink-0 rounded-full border border-slate-700/70 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-indigo-500 hover:bg-slate-800 hover:text-white sm:px-4 sm:text-sm"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular categories */}
            <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                            Popular Categories
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                            Explore talent across the most
                            in-demand skills.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={category.path}
                                className="card-hover fade-in flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm sm:gap-3 sm:p-6"
                            >
                                <span className="text-2xl sm:text-3xl">
                                    {category.icon}
                                </span>

                                <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured freelancers */}
            <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                                Featured Freelancers
                            </h2>

                            <p className="mt-3 text-sm text-slate-600 sm:text-base">
                                Discover highly rated
                                professionals ready to work on
                                your project.
                            </p>
                        </div>

                        <Link
                            to="/freelancers"
                            className="w-fit rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            View all freelancers
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {featuredFreelancers.map(
                            (freelancer) => (
                                <article
                                    key={freelancer.id}
                                    className="card-hover fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 sm:h-14 sm:w-14 sm:text-xl">
                                            {freelancer.name.charAt(
                                                0
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-slate-900">
                                                {
                                                    freelancer.name
                                                }
                                            </h3>

                                            <p className="truncate text-sm text-slate-600">
                                                {
                                                    freelancer.title
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-amber-600">
                                        ⭐ {freelancer.rating} (
                                        {freelancer.reviews}{" "}
                                        reviews)
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {freelancer.skills.map(
                                            (skill) => (
                                                <span
                                                    key={
                                                        skill
                                                    }
                                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-slate-600">
                                            Starting at{" "}
                                            <span className="font-semibold text-slate-900">
                                                ₹
                                                {
                                                    freelancer.startingAt
                                                }
                                            </span>
                                        </p>

                                        <Link
                                            to="/freelancers"
                                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Ready to get started?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm text-indigo-100 sm:text-base">
                        Post a job to hire talent, or create a
                        freelancer profile to find your next
                        opportunity.
                    </p>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/register"
                                    className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                >
                                    Create Account
                                </Link>

                                <Link
                                    to="/jobs"
                                    className="w-full rounded-xl border border-white/40 px-6 py-3 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
                                >
                                    Browse Jobs
                                </Link>
                            </>
                        )}

                        {isAuthenticated &&
                            user?.role === "client" && (
                                <>
                                    <Link
                                        to="/client/post-job"
                                        className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                    >
                                        Post a Job
                                    </Link>

                                    <Link
                                        to="/client/sent-invitations"
                                        className="w-full rounded-xl border border-white/40 px-6 py-3 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
                                    >
                                        Sent Invitations
                                    </Link>
                                </>
                            )}

                        {isAuthenticated &&
                            user?.role === "freelancer" && (
                                <>
                                    <Link
                                        to="/freelancer/hire-requests"
                                        className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                    >
                                        Hire Requests
                                    </Link>

                                    <Link
                                        to="/freelancer/my-projects"
                                        className="w-full rounded-xl border border-white/40 px-6 py-3 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
                                    >
                                        My Projects
                                    </Link>
                                </>
                            )}

                        {isAuthenticated &&
                            user?.role === "admin" && (
                                <Link
                                    to="/admin/dashboard"
                                    className="w-full rounded-xl bg-white px-6 py-3 text-center text-base font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;