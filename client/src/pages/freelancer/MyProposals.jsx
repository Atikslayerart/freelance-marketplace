import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProposals } from "../../services/proposalService";

function MyProposals() {
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const data = await getMyProposals(token);

                setProposals(data.proposals);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load proposals."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProposals();
    }, []);

    const getStatusStyles = (status) => {
        if (status === "accepted") {
            return "bg-green-50 text-green-700";
        }

        if (status === "rejected") {
            return "bg-red-50 text-red-700";
        }

        if (status === "shortlisted") {
            return "bg-blue-50 text-blue-700";
        }

        return "bg-slate-100 text-slate-700";
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Proposals
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Track the proposals you have submitted.
                    </p>
                </header>

                {error && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="text-slate-600">Loading proposals...</p>
                ) : proposals.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            No proposals submitted yet
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Browse open jobs and submit your first proposal.
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {proposals.map((proposal) => (
                            <article
                                key={proposal._id}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {proposal.job?.title ||
                                                "Job no longer available"}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Submitted on{" "}
                                            {formatDate(proposal.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyles(
                                            proposal.status
                                        )}`}
                                    >
                                        {proposal.status}
                                    </span>
                                </div>

                                {proposal.job && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                            {proposal.job.category}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                            {proposal.job.budgetType ===
                                                "fixed"
                                                ? `Client budget: ₹${proposal.job.budgetAmount}`
                                                : `Client budget: ₹${proposal.job.budgetAmount}/hour`}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                            Your bid: ₹{proposal.bidAmount}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                            Delivery: {proposal.deliveryTime}
                                        </span>
                                    </div>
                                )}

                                <p className="mt-4 line-clamp-3 text-sm text-slate-600">
                                    {proposal.coverLetter}
                                </p>

                                {proposal.job && (
                                    <Link
                                        to={`/jobs/${proposal.job._id}`}
                                        className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        View Job
                                    </Link>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MyProposals;