import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyHireRequests } from "../../services/hireRequestService";

function SentInvitations() {
    const [requests, setRequests] =
        useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data =
                    await getMyHireRequests();

                setRequests(
                    data.hireRequests || []
                );
            } catch (err) {
                setError(
                    err.message ||
                    "Failed to load invitations."
                );
            } finally {
                setLoading(false);
            }
        };

        loadRequests();
    }, []);

    if (loading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <p>Loading invitations...</p>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/client/dashboard"
                    className="mb-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to dashboard
                </Link>

                <h1 className="text-2xl font-bold text-slate-900">
                    Sent Invitations
                </h1>

                <p className="mt-1 text-slate-600">
                    Freelancers you have invited
                    to your jobs.
                </p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {requests.length === 0 ? (
                    <div className="mt-8 rounded-2xl bg-white p-8 text-center">
                        <p className="text-slate-600">
                            You have not sent any
                            hire invitations yet.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {requests.map(
                            (request) => (
                                <article
                                    key={
                                        request._id
                                    }
                                    className="rounded-2xl bg-white p-6 shadow-sm"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">
                                                {
                                                    request
                                                        .freelancer
                                                        ?.name
                                                }
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-600">
                                                Job:{" "}
                                                {
                                                    request
                                                        .job
                                                        ?.title
                                                }
                                            </p>

                                            {request.message && (
                                                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                                                    {
                                                        request.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${request.status ===
                                                    "pending"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : request.status ===
                                                        "accepted"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {
                                                request.status
                                            }
                                        </span>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default SentInvitations;