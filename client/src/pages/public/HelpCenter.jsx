import { Link } from "react-router-dom";

const faqs = [
    {
        question: "How do I post a job?",
        answer:
            "Create a client account, open your dashboard, click Post a Job, fill in the job details, and publish it. Freelancers can then submit proposals.",
    },
    {
        question: "How do I apply for a job?",
        answer:
            "Create a freelancer account, browse available jobs, open a job that matches your skills, and click Apply Now to submit your proposal.",
    },
    {
        question: "How does hiring work?",
        answer:
            "A client can invite a freelancer to one of their posted jobs. Once the freelancer accepts, a project is created and both users can manage it from their dashboards.",
    },
    {
        question: "Can I message a client or freelancer?",
        answer:
            "Yes. Use the Contact button on a freelancer profile or the Messages page to start a conversation.",
    },
    {
        question: "How are reviews calculated?",
        answer:
            "Reviews can be submitted after a project is completed. Ratings for communication, quality, and timeliness contribute to the freelancer’s overall rating.",
    },
];

function HelpCenter() {
    return (
        <main className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="fade-in rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-sm sm:p-10">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Help Center
                    </h1>

                    <p className="mt-3 max-w-2xl text-indigo-100">
                        Find answers to common
                        questions about using
                        FreelanceHub.
                    </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {faqs.map((faq) => (
                        <article
                            key={faq.question}
                            className="card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <h2 className="font-semibold text-slate-900">
                                {faq.question}
                            </h2>

                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                {faq.answer}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Still need help?
                    </h2>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                        If you cannot find the answer
                        you need, contact our support
                        team.
                    </p>

                    <Link
                        to="/contact"
                        className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default HelpCenter;