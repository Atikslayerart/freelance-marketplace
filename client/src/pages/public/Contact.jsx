import { useState } from "react";
import { Link } from "react-router-dom";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setStatus("loading");
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const apiUrl =
                import.meta.env.VITE_API_URL || "http://localhost:5000";

            const response = await fetch(`${apiUrl}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const rawResponse = await response.text();

            let data = {};

            if (rawResponse) {
                try {
                    data = JSON.parse(rawResponse);
                } catch (error) {
                    console.error(
                        "Invalid JSON response from server:",
                        rawResponse
                    );
                }
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `Request failed with status ${response.status}`
                );
            }

            setStatus("success");
            setSuccessMessage(
                data.message ||
                "Your message has been received. We will reply soon."
            );

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <main className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
                {/* Left side */}
                <div className="fade-in">
                    <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Contact Us
                    </h1>

                    <p className="mt-4 text-slate-600">
                        Have a question, found an issue, or need help
                        with your account? Send us a message and our
                        team will get back to you.
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="font-semibold text-slate-900">
                                Email Support
                            </h2>

                            <p className="mt-1 text-sm text-slate-600">
                                support@freelancehub.com
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="font-semibold text-slate-900">
                                Support Hours
                            </h2>

                            <p className="mt-1 text-sm text-slate-600">
                                Monday to Friday, 9:00 AM – 6:00 PM IST
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="font-semibold text-slate-900">
                                Need quick answers?
                            </h2>

                            <Link
                                to="/help-center"
                                className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Visit Help Center →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right side form */}
                <div className="fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    {status === "success" ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                            <h2 className="text-xl font-semibold text-green-800">
                                Message sent!
                            </h2>

                            <p className="mt-2 text-sm text-green-700">
                                {successMessage}
                            </p>

                            <button
                                onClick={() => setStatus("idle")}
                                className="mt-5 rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {status === "error" && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                            >
                                {status === "loading"
                                    ? "Sending..."
                                    : "Send Message"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Contact;