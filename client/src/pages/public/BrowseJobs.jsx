import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getJobs } from "../../services/jobService";

const categories = [
    "all",
    "web-development",
    "mobile-development",
    "design",
    "writing",
    "marketing",
    "data-entry",
    "other",
];

const budgetTypes = [
    "all",
    "fixed",
    "hourly",
];

const sortOptions = [
    {
        value: "newest",
        label: "Newest first",
    },
    {
        value: "budget-high",
        label: "Budget: high to low",
    },
    {
        value: "budget-low",
        label: "Budget: low to high",
    },
];

function BrowseJobs() {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const urlCategory =
        searchParams.get("category") || "all";

    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState(urlCategory);
    const [budgetType, setBudgetType] =
        useState("all");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    // Sync category from URL when user clicks a Home category card
    useEffect(() => {
        setCategory(urlCategory);
    }, [urlCategory]);

    // Keep the URL updated when user changes category manually
    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;

        setCategory(newCategory);

        if (newCategory === "all") {
            searchParams.delete("category");
        } else {
            searchParams.set("category", newCategory);
        }

        setSearchParams(searchParams);
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setIsLoading(true);

                const data = await getJobs({
                    search,
                    category,
                    budgetType,
                    minBudget,
                    maxBudget,
                    sortBy,
                });

                setJobs(data.jobs);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load jobs."
                );
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchJobs();
        }, 400);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [
        search,
        category,
        budgetType,
        minBudget,
        maxBudget,
        sortBy,
    ]);

    const handleResetFilters = () => {
        setSearch("");
        setCategory("all");
        setBudgetType("all");
        setMinBudget("");
        setMaxBudget("");
        setSortBy("newest");

        searchParams.delete("category");
        setSearchParams(searchParams);
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Browse Jobs
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Find open jobs that match your
                        skills.
                    </p>

                    {category !== "all" && (
                        <p className="mt-3 text-sm text-indigo-700">
                            Showing jobs in{" "}
                            <span className="font-semibold">
                                {category
                                    .replace("-", " ")
                                    .replace(
                                        /\b\w/g,
                                        (letter) =>
                                            letter.toUpperCase()
                                    )}
                            </span>
                        </p>
                    )}
                </header>

                <section className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Search
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Search jobs..."
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={
                                    handleCategoryChange
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            >
                                {categories.map(
                                    (
                                        categoryOption
                                    ) => (
                                        <option
                                            key={
                                                categoryOption
                                            }
                                            value={
                                                categoryOption
                                            }
                                        >
                                            {categoryOption
                                                .replace(
                                                    "-",
                                                    " "
                                                )
                                                .replace(
                                                    /\b\w/g,
                                                    (
                                                        letter
                                                    ) =>
                                                        letter.toUpperCase()
                                                )}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Budget type
                            </label>

                            <select
                                value={budgetType}
                                onChange={(event) =>
                                    setBudgetType(
                                        event.target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            >
                                {budgetTypes.map(
                                    (
                                        budgetTypeOption
                                    ) => (
                                        <option
                                            key={
                                                budgetTypeOption
                                            }
                                            value={
                                                budgetTypeOption
                                            }
                                        >
                                            {budgetTypeOption
                                                .replace(
                                                    "-",
                                                    " "
                                                )
                                                .replace(
                                                    /\b\w/g,
                                                    (
                                                        letter
                                                    ) =>
                                                        letter.toUpperCase()
                                                )}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Min budget
                            </label>

                            <input
                                type="number"
                                value={minBudget}
                                onChange={(event) =>
                                    setMinBudget(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="0"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Max budget
                            </label>

                            <input
                                type="number"
                                value={maxBudget}
                                onChange={(event) =>
                                    setMaxBudget(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="100000"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Sort by
                            </label>

                            <select
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(
                                        event.target
                                            .value
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            >
                                {sortOptions.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleResetFilters
                        }
                        className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                        Reset filters
                    </button>
                </section>

                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="mt-8 text-slate-600">
                        Loading jobs...
                    </p>
                ) : jobs.length === 0 ? (
                    <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            No jobs found
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Try changing your search or
                            filters.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <article
                                key={job._id}
                                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
                            >
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {job.title}
                                </h2>

                                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                                    {job.description}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                                        {job.category}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                                        {job.budgetType}
                                    </span>

                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                        ₹
                                        {
                                            job.budgetAmount
                                        }
                                    </span>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-sm text-slate-500">
                                        {
                                            job.status
                                        }
                                    </span>

                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        View Job
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

export default BrowseJobs;