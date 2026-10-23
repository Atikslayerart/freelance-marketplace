import { useEffect, useState } from "react";
import {
    getContactMessages,
    updateContactMessageStatus,
} from "../../services/adminService";


const statusOptions = [
    { value: "all", label: "All" },
    { value: "new", label: "New" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
];


const statusStyles = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
};


function ContactMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);


    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");


            const data = await getContactMessages({
                status,
                search,
                page,
                limit: 10,
            });


            setMessages(data.data);
            setPagination(data.pagination);
        } catch (error) {
            setError(
                error.message ||
                "Unable to load contact messages."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMessages();
    }, [status, page]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchMessages();
        }, 500);


        return () => clearTimeout(timer);
    }, [search]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);


            await updateContactMessageStatus(id, newStatus);


            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === id
                        ? { ...message, status: newStatus }
                        : message
                )
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to update message status."
            );
        } finally {
            setUpdatingId(null);
        }
    };


    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Contact Messages
                        </h1>


                        <p className="mt-1 text-sm text-slate-600">
                            Manage messages submitted through the
                            Contact Us form.
                        </p>
                    </div>


                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search name, email or subject..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
                    />
                </div>


                {/* Filters */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setStatus(option.value);
                                setPage(1);
                            }}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${status === option.value
                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>


                {/* Error */}
                {error && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {/* Loading */}
                {loading ? (
                    <div className="mt-10 text-center text-sm text-slate-500">
                        Loading contact messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No messages found
                        </h2>


                        <p className="mt-2 text-sm text-slate-600">
                            There are no contact messages matching
                            your filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div className="mt-6 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-base font-semibold text-slate-900">
                                                    {message.subject}
                                                </h2>


                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[
                                                        message.status
                                                        ]
                                                        }`}
                                                >
                                                    {message.status.replace(
                                                        "-",
                                                        " "
                                                    )}
                                                </span>
                                            </div>


                                            <p className="mt-1 text-sm text-slate-600">
                                                {message.name} •{" "}
                                                {message.email}
                                            </p>


                                            <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                                {message.message}
                                            </p>


                                            <p className="mt-3 text-xs text-slate-500">
                                                Received on{" "}
                                                {new Date(
                                                    message.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>


                                        <div className="flex shrink-0 items-center gap-2">
                                            <select
                                                value={message.status}
                                                disabled={
                                                    updatingId ===
                                                    message._id
                                                }
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        message._id,
                                                        event.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                                            >
                                                <option value="new">
                                                    New
                                                </option>


                                                <option value="in-progress">
                                                    In Progress
                                                </option>


                                                <option value="resolved">
                                                    Resolved
                                                </option>
                                            </select>


                                            <a
                                                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                                            >
                                                Reply
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={() =>
                                        setPage((prev) => prev - 1)
                                    }
                                    disabled={
                                        !pagination.hasPrevPage
                                    }
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>


                                <p className="text-sm text-slate-600">
                                    Page {pagination.currentPage} of{" "}
                                    {pagination.totalPages}
                                </p>


                                <button
                                    onClick={() =>
                                        setPage((prev) => prev + 1)
                                    }
                                    disabled={
                                        !pagination.hasNextPage
                                    }
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}


export default ContactMessages;