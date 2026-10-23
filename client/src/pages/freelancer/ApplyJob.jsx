import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../../services/jobService";
import { submitProposal } from "../../services/proposalService";

function ApplyJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        coverLetter: "",
        bidAmount: "",
        deliveryTime: "7 days",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(jobId);

                setJob(data.job);
            } catch (fetchError) {
                setError(
                    fetchError.message || "Failed to load job details."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("authToken");

            await submitProposal(
                jobId,
                {
                    coverLetter: formData.coverLetter.trim(),
                    bidAmount: Number(formData.bidAmount),
                    deliveryTime: formData.deliveryTime,
                },
                token
            );

            navigate("/freelancer/my-proposals");
        } catch (proposalError) {
            setError(
                proposalError.message ||
                "Failed to submit proposal. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-2xl">
                    <p className="text-slate-600">Loading job...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-2xl">
                <Link
                    to={`/jobs/${jobId}`}
                    className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                >
                    ← Back to job
                </Link>

                <section className="rounded-2xl bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Submit Proposal
                    </h1>

                    {job && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                            <h2 className="font-semibold text-slate-900">
                                {job.title}
                            </h2>

                            <p className="mt-1 text-sm text-slate-600">
                                {job.budgetType === "fixed"
                                    ? `Client budget: ₹${job.budgetAmount} fixed`
                                    : `Client budget: ₹${job.budgetAmount}/hour`}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Cover letter
                            </span>
                            <textarea
                                name="coverLetter"
                                rows={6}
                                required
                                value={formData.coverLetter}
                                onChange={handleChange}
                                placeholder="Explain why you are the right freelancer for this job."
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Your bid (₹)
                            </span>
                            <input
                                type="number"
                                name="bidAmount"
                                min="1"
                                required
                                value={formData.bidAmount}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Estimated delivery
                            </span>
                            <select
                                name="deliveryTime"
                                required
                                value={formData.deliveryTime}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                <option value="1 day">1 day</option>
                                <option value="3 days">3 days</option>
                                <option value="7 days">7 days</option>
                                <option value="14 days">14 days</option>
                                <option value="30 days">30 days</option>
                            </select>
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Submitting proposal..."
                                : "Submit Proposal"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default ApplyJob;