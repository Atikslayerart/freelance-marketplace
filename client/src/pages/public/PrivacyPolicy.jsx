import { Link } from "react-router-dom";

const sections = [
    {
        title: "Information We Collect",
        content:
            "We collect the information you provide when creating an account, such as your name, email address, role, profile details, skills, portfolio items, and messages you send through the platform.",
    },
    {
        title: "How We Use Information",
        content:
            "We use your information to operate the marketplace, show relevant jobs and freelancers, enable messaging, process proposals and projects, send notifications, and improve the platform.",
    },
    {
        title: "Profile Visibility",
        content:
            "Freelancer profiles, skills, portfolios, ratings, and reviews may be visible to other users. Clients can control the information they add to their company profile.",
    },
    {
        title: "Messages and Notifications",
        content:
            "Messages and notifications are stored so you can view your conversation history and important account updates after logging back in.",
    },
    {
        title: "Data Security",
        content:
            "We use security measures such as password hashing and authentication tokens to protect your account. Do not share your password with anyone.",
    },
    {
        title: "Your Choices",
        content:
            "You can update your profile information, manage your skills and portfolio, and contact support if you need help with your account.",
    },
];

function PrivacyPolicy() {
    return (
        <main className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-4 text-slate-600">
                        This Privacy Policy explains
                        how FreelanceHub collects,
                        uses, and protects your
                        information.
                    </p>

                    <div className="mt-8 space-y-8">
                        {sections.map(
                            (section) => (
                                <section
                                    key={
                                        section.title
                                    }
                                >
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        {
                                            section.title
                                        }
                                    </h2>

                                    <p className="mt-3 leading-relaxed text-slate-600">
                                        {
                                            section.content
                                        }
                                    </p>
                                </section>
                            )
                        )}
                    </div>

                    <div className="mt-10 rounded-xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-600">
                            If you have questions
                            about this policy, please
                            visit our{" "}
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

export default PrivacyPolicy;