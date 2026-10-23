import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getMyHireRequests,
    updateHireRequestStatus,
} from "../../services/hireRequestService";

function HireRequests() {
    const [requests, setRequests] =
        useState([]);
    const [loading, setLoading] =
        useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] =
        useState("");

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
                "Failed to load hire requests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleUpdateStatus = async (
        requestId,
        status
    ) => {
        setUpdatingId(requestId);

        try {
            await updateHireRequestStatus(
                requestId,
                status
            );

            setRequests((prev) =>
                prev.map((request) =>
                    request._id === requestId
                        ? {
                            ...request,
                            status,
                        }
                        : request
                )
            );
        } catch (err) {
            setError(
                err.message ||
                "Failed to update request."
            );
        } finally {
            setUpdatingId("");
        }
    };

    if (loading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <p>Loading hire requests...</p>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/freelancer/dashboard"
                    className="mb-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to dashboard
                </Link>

                <h1 className="text-2xl font-bold text-slate-900">
                    Hire Requests
                </h1>

                <p className="mt-1 text-slate-600">
                    Invitations received from
                    clients.
                </p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {requests.length === 0 ? (
                    <div className="mt-8 rounded-2xl bg-white p-8 text-center">
                        <p className="text-slate-600">
                            No hire requests yet.
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
                                                        .job
                                                        ?.title
                                                }
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-600">
                                                From{" "}
                                                {
                                                    request
                                                        .client
                                                        ?.name
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

                                    {request.status ===
                                        "pending" && (
                                            <div className="mt-5 flex gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            request._id,
                                                            "accepted"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        request._id
                                                    }
                                                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            request._id,
                                                            "rejected"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        request._id
                                                    }
                                                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                </article>
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default HireRequests;