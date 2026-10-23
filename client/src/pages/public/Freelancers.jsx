import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFreelancers } from "../../services/userService";

function Freelancers() {
    const [freelancers, setFreelancers] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const data = await getFreelancers();

                setFreelancers(data.freelancers);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load freelancers."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchFreelancers();
    }, []);

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Browse Freelancers
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Find skilled freelancers for your next project.
                    </p>
                </header>

                {error && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="text-slate-600">Loading freelancers...</p>
                ) : freelancers.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            No freelancers found
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Freelancer profiles will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {freelancers.map((freelancer) => (
                            <article
                                key={freelancer._id}
                                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                                        {freelancer.name?.charAt(0) || "F"}
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {freelancer.name}
                                        </h2>

                                        <p className="text-sm text-slate-500">
                                            ⭐ {freelancer.rating || 0} •{" "}
                                            {freelancer.totalReviews || 0}{" "}
                                            reviews
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                                    {freelancer.bio ||
                                        "No bio added yet."}
                                </p>

                                {freelancer.skills?.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {freelancer.skills
                                            .slice(0, 3)
                                            .map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <p className="text-sm font-medium text-slate-700">
                                        {freelancer.hourlyRate
                                            ? `₹${freelancer.hourlyRate}/hour`
                                            : "Rate not added"}
                                    </p>

                                    <Link
                                        to={`/freelancers/${freelancer._id}`}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Freelancers;