import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("freelancer");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            await register({
                name: name.trim(),
                email: email.trim(),
                role,
                password,
            });

            setSuccess("Account created successfully.");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error.response?.data || error);

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                `Registration failed (${error.response?.status || "network error"}).`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-6 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Create an account
                </h1>

                <p className="mt-2 text-slate-600">
                    Join clients and freelancers building great work.
                </p>

                {error && (
                    <div
                        role="alert"
                        className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
                    >
                        {success}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                            Full name
                        </span>
                        <input
                            type="text"
                            required
                            minLength={2}
                            maxLength={60}
                            autoComplete="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                            placeholder="Your name"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                            Email
                        </span>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                            placeholder="you@example.com"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                            Account type
                        </span>
                        <select
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                        >
                            <option value="freelancer">Freelancer</option>
                            <option value="client">Client</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                            Password
                        </span>
                        <input
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                            placeholder="At least 6 characters"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-600">
                        Log in
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default Register;