import { Link } from "react-router-dom";

const terms = [
    {
        title: "Using FreelanceHub",
        content:
            "By creating an account, you agree to provide accurate information and use the platform only for lawful freelance and hiring activities.",
    },
    {
        title: "Client Responsibilities",
        content:
            "Clients should provide clear job requirements, respond to proposals professionally, and manage projects fairly after hiring a freelancer.",
    },
    {
        title: "Freelancer Responsibilities",
        content:
            "Freelancers should submit accurate proposals, maintain professional communication, and complete accepted work according to the agreed requirements.",
    },
    {
        title: "Proposals and Hiring",
        content:
            "Submitting a proposal does not guarantee selection. A project is created only after a client hires a freelancer or accepts an invitation.",
    },
    {
        title: "Reviews",
        content:
            "Reviews must be honest and related to actual completed work. Misleading, abusive, or fake reviews may be removed.",
    },
    {
        title: "Account Suspension",
        content:
            "Accounts may be limited or suspended for fraudulent activity, spam, harassment, or violation of these terms.",
    },
];

function TermsOfService() {
    return (
        <main className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Terms of Service
                    </h1>

                    <p className="mt-4 text-slate-600">
                        These terms govern your use
                        of the FreelanceHub
                        marketplace.
                    </p>

                    <div className="mt-8 space-y-8">
                        {terms.map((term) => (
                            <section
                                key={term.title}
                            >
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {term.title}
                                </h2>

                                <p className="mt-3 leading-relaxed text-slate-600">
                                    {term.content}
                                </p>
                            </section>
                        ))}
                    </div>

                    <div className="mt-10 rounded-xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-600">
                            For questions about these
                            terms, please visit our{" "}
                            <Link
                                to="/contact"
                                className="font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Contact Us
                            </Link>{" "}
                            page.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TermsOfService;