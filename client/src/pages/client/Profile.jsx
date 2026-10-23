import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientProfile } from "../../services/userService";

function ClientProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile =
                    await getClientProfile();

                setUser(profile);
            } catch (err) {
                setError(
                    err.message ||
                    "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Loading profile...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-100">
                <p className="text-slate-600">
                    Profile not found.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <Link
                    to="/client/dashboard"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200"
                >
                    ← Back
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                                {user?.name?.charAt(0) ||
                                    "C"}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {user?.name ||
                                        "Client"}
                                </h1>

                                <p className="text-slate-600">
                                    {user?.email}
                                </p>

                                <span className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                                    Client
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/client/edit-profile"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Company
                        </h2>

                        <p className="mt-2 text-slate-600">
                            {user?.companyName ||
                                "Add your company name."}
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            About
                        </h2>

                        <p className="mt-2 text-slate-600">
                            {user?.companyDescription ||
                                user?.bio ||
                                "Add a short company or personal bio."}
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Location
                        </h2>

                        <p className="mt-2 text-slate-600">
                            {user?.location ||
                                "Add your location."}
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Account details
                        </h2>

                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Member since
                                </p>

                                <p className="mt-1 font-medium text-slate-900">
                                    {user?.createdAt
                                        ? new Date(
                                            user.createdAt
                                        ).toLocaleDateString()
                                        : "Not available"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Account status
                                </p>

                                <p className="mt-1 font-medium text-slate-900">
                                    {user?.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ClientProfile;