import { useEffect, useState } from "react";
import {
    getUsers,
    updateUser,
    deleteUser,
} from "../../services/adminService";

const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "freelancer", label: "Freelancers" },
    { value: "client", label: "Clients" },
    { value: "admin", label: "Admins" },
];

const roleStyles = {
    freelancer: "bg-indigo-50 text-indigo-700 border-indigo-200",
    client: "bg-sky-50 text-sky-700 border-sky-200",
    admin: "bg-slate-100 text-slate-700 border-slate-300",
};

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getUsers({
                search,
                role,
                page,
                limit: 10,
            });

            setUsers(data.data);
            setPagination(data.pagination);
        } catch (error) {
            setError(
                error.message ||
                "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsers();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleUpdateUser = async (id, updates) => {
        try {
            setUpdatingId(id);

            await updateUser(id, updates);

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === id
                        ? { ...user, ...updates }
                        : user
                )
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to update user."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        try {
            setUpdatingId(id);

            await deleteUser(id);

            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== id)
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to delete user."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Manage Users
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            View, manage, and moderate all
                            FreelanceHub accounts.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search name or email..."
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
                    />
                </div>

                {/* Filters */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {roleOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setRole(option.value);
                                setPage(1);
                            }}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${role === option.value
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
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No users found
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            There are no users matching your
                            filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Users table */}
                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                User
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Role
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Joined
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {users.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {user.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${roleStyles[
                                                            user.role
                                                            ]
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${user.isActive
                                                                ? "border-green-200 bg-green-50 text-green-700"
                                                                : "border-red-200 bg-red-50 text-red-700"
                                                            }`}
                                                    >
                                                        {user.isActive
                                                            ? "Active"
                                                            : "Suspended"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <select
                                                            value={
                                                                user.role
                                                            }
                                                            disabled={
                                                                updatingId ===
                                                                user._id
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                handleUpdateUser(
                                                                    user._id,
                                                                    {
                                                                        role: event
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                                                        >
                                                            <option value="freelancer">
                                                                Freelancer
                                                            </option>

                                                            <option value="client">
                                                                Client
                                                            </option>

                                                            <option value="admin">
                                                                Admin
                                                            </option>
                                                        </select>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                updatingId ===
                                                                user._id
                                                            }
                                                            onClick={() =>
                                                                handleUpdateUser(
                                                                    user._id,
                                                                    {
                                                                        isActive:
                                                                            !user.isActive,
                                                                    }
                                                                )
                                                            }
                                                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${user.isActive
                                                                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                                    : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                                                }`}
                                                        >
                                                            {user.isActive
                                                                ? "Suspend"
                                                                : "Activate"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                updatingId ===
                                                                user._id
                                                            }
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user._id
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pagination &&
                            pagination.totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between">
                                    <button
                                        onClick={() =>
                                            setPage(
                                                (prev) => prev - 1
                                            )
                                        }
                                        disabled={
                                            !pagination.hasPrevPage
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    <p className="text-sm text-slate-600">
                                        Page{" "}
                                        {pagination.currentPage} of{" "}
                                        {pagination.totalPages}
                                    </p>

                                    <button
                                        onClick={() =>
                                            setPage(
                                                (prev) => prev + 1
                                            )
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

export default AdminUsers;