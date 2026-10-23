import { Link } from "react-router-dom";

const steps = [
    {
        number: "01",
        title: "Create your account",
        description:
            "Join as a client to hire talent or as a freelancer to find work opportunities.",
    },
    {
        number: "02",
        title: "Post jobs or build proposals",
        description:
            "Clients publish clear job requirements. Freelancers browse jobs and submit tailored proposals.",
    },
    {
        number: "03",
        title: "Connect and collaborate",
        description:
            "Message each other, share project details, and align on scope, budget, and delivery time.",
    },
    {
        number: "04",
        title: "Complete work and review",
        description:
            "Track project progress, submit completed work, and leave honest reviews after completion.",
    },
];

const roles = [
    {
        title: "For Clients",
        description:
            "Post jobs, review proposals, invite freelancers, manage active projects, and leave reviews after completion.",
        path: "/client/dashboard",
        buttonText: "Client Dashboard",
    },
    {
        title: "For Freelancers",
        description:
            "Build a professional profile, showcase skills and portfolio, apply for jobs, and manage projects.",
        path: "/freelancer/dashboard",
        buttonText: "Freelancer Dashboard",
    },
    {
        title: "For Admins",
        description:
            "Monitor users, jobs, projects, reports, and platform activity from a central admin dashboard.",
        path: "/admin/dashboard",
        buttonText: "Admin Dashboard",
    },
];

const values = [
    {
        icon: "🎯",
        title: "Quality-first",
        description:
            "We help clients find skilled freelancers and help freelancers find meaningful work.",
    },
    {
        icon: "🤝",
        title: "Transparent collaboration",
        description:
            "Clear proposals, direct messaging, and project tracking keep everyone aligned.",
    },
    {
        icon: "⚡",
        title: "Faster hiring",
        description:
            "Search jobs, discover talent, send invitations, and start projects without unnecessary friction.",
    },
    {
        icon: "⭐",
        title: "Trust through reviews",
        description:
            "Real project reviews help build credibility and make hiring decisions easier.",
    },
];

const supportLinks = [
    {
        label: "Help Center",
        path: "/help-center",
        description:
            "Find answers to common questions.",
    },
    {
        label: "Contact Us",
        path: "/contact",
        description:
            "Send a message to our support team.",
    },
    {
        label: "Privacy Policy",
        path: "/privacy-policy",
        description:
            "Learn how we handle your data.",
    },
    {
        label: "Terms of Service",
        path: "/terms-of-service",
        description:
            "Read the rules for using FreelanceHub.",
    },
];

function About() {
    return (
        <main className="w-full overflow-x-hidden bg-slate-950 text-white">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900" />

                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

                <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                    <div className="fade-in mx-auto max-w-3xl text-center">
                        <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 sm:text-sm">
                            About FreelanceHub
                        </span>

                        <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                            A better way to connect
                            talent with opportunity
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg">
                            FreelanceHub is a modern
                            freelance marketplace that
                            connects clients with skilled
                            freelancers—making it easier
                            to post work, discover talent,
                            collaborate, and build great
                            projects.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link
                                to="/jobs"
                                className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
                            >
                                Browse Jobs
                            </Link>

                            <Link
                                to="/freelancers"
                                className="w-full rounded-xl border border-slate-700 bg-white/5 px-6 py-3 text-center text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
                            >
                                Find Freelancers
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="fade-in">
                            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                                Our mission
                            </h2>

                            <p className="mt-5 leading-relaxed text-slate-300">
                                We want to make hiring and
                                getting hired simpler. Whether
                                you are a client looking for
                                the right freelancer or a
                                freelancer looking for your
                                next opportunity, FreelanceHub
                                brings both sides together in
                                one place.
                            </p>

                            <p className="mt-4 leading-relaxed text-slate-300">
                                From posting jobs and
                                submitting proposals to
                                managing projects and
                                exchanging feedback, the
                                platform supports the complete
                                freelance workflow.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                                    <p className="text-2xl font-bold text-indigo-400 sm:text-3xl">
                                        3
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        User roles
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                                    <p className="text-2xl font-bold text-indigo-400 sm:text-3xl">
                                        100%
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Built for collaboration
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="fade-in rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8">
                            <h3 className="text-lg font-semibold text-white">
                                How FreelanceHub works
                            </h3>

                            <div className="mt-6 space-y-5">
                                {steps.map((step) => (
                                    <div
                                        key={step.number}
                                        className="flex gap-4"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-sm font-bold text-indigo-300">
                                            {step.number}
                                        </span>

                                        <div>
                                            <h4 className="font-semibold text-white">
                                                {step.title}
                                            </h4>

                                            <p className="mt-1 text-sm leading-relaxed text-slate-400">
                                                {
                                                    step.description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roles */}
            <section className="border-y border-slate-800 bg-slate-900/50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                            Built for every user
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
                            FreelanceHub gives clients,
                            freelancers, and admins the tools
                            they need to work effectively.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {roles.map((role) => (
                            <article
                                key={role.title}
                                className="card-hover fade-in flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-semibold text-white">
                                    {role.title}
                                </h3>

                                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                                    {role.description}
                                </p>

                                <Link
                                    to={role.path}
                                    className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
                                >
                                    {role.buttonText}
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                            What we value
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
                            A great marketplace is built on
                            clarity, trust, and smooth
                            collaboration.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => (
                            <article
                                key={value.title}
                                className="card-hover fade-in rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
                            >
                                <span className="text-3xl">
                                    {value.icon}
                                </span>

                                <h3 className="mt-4 font-semibold text-white">
                                    {value.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                    {value.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support */}
            <section className="border-t border-slate-800 bg-slate-900/50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                            Support & policies
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
                            Need help or want to learn more
                            about how FreelanceHub works?
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2">
                        {supportLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="card-hover fade-in group rounded-2xl border border-slate-800 bg-slate-950 p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            {link.label}
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-400">
                                            {
                                                link.description
                                            }
                                        </p>
                                    </div>

                                    <span className="text-indigo-400 transition group-hover:translate-x-1">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                        Ready to start your next project?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
                        Join FreelanceHub to hire skilled
                        freelancers or find your next
                        freelance opportunity.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;