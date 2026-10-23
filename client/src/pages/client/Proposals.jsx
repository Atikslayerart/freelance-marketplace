import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getJobProposals,
    updateProposalStatus,
} from "../../services/proposalService";

function ClientProposals() {
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [updatingProposalId, setUpdatingProposalId] = useState(null);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const data = await getJobProposals(jobId, token);

                setJob(data.job);
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
    }, [jobId]);

    const handleStatusUpdate = async (proposalId, status) => {
        setError("");
        setUpdatingProposalId(proposalId);

        try {
            const token = localStorage.getItem("authToken");

            const data = await updateProposalStatus(
                proposalId,
                status,
                token
            );

            setProposals((previousProposals) =>
                previousProposals.map((proposal) =>
                    proposal._id === proposalId
                        ? data.proposal
                        : proposal
                )
            );
        } catch (updateError) {
            setError(
                updateError.message ||
                    "Failed to update proposal."
            );
        } finally {
            setUpdatingProposalId(null);
        }
    };

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

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-5xl">
                    <p className="text-slate-600">Loading proposals...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/client/my-jobs"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to My Jobs
                </Link>

                <header className="rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {job?.title || "Job proposals"}
                    </h1>

                    <p className="mt-2 text-slate-600">
                        {proposals.length} proposal
                        {proposals.length === 1 ? "" : "s"} received
                    </p>
                </header>

                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <section className="mt-8 space-y-5">
                    {proposals.length === 0 ? (
                        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">
                                No proposals yet
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Freelancers who apply to this job will appear
                                here.
                            </p>
                        </div>
                    ) : (
                        proposals.map((proposal) => (
                            <article
                                key={proposal._id}
                                className="rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {proposal.freelancer?.name ||
                                                "Freelancer"}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Bid: ₹{proposal.bidAmount} •
                                            Delivery: {proposal.deliveryTime}
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

                                {proposal.freelancer?.skills?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {proposal.freelancer.skills.map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                                <p className="mt-4 whitespace-pre-line text-sm text-slate-600">
                                    {proposal.coverLetter}
                                </p>

                                {proposal.status === "pending" && (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            disabled={
                                                updatingProposalId ===
                                                proposal._id
                                            }
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    proposal._id,
                                                    "accepted"
                                                )
                                            }
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                updatingProposalId ===
                                                proposal._id
                                            }
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    proposal._id,
                                                    "rejected"
                                                )
                                            }
                                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                                        >
                                            Reject
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                updatingProposalId ===
                                                proposal._id
                                            }
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    proposal._id,
                                                    "shortlisted"
                                                )
                                            }
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            Shortlist
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))
                    )}
                </section>
            </div>
        </main>
    );
}

export default ClientProposals;