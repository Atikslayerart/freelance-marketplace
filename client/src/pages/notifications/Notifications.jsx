import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../../services/notificationService";
import { useNotifications } from "../../context/NotificationContext";

function Notifications() {
    const { setUnreadCount } = useNotifications();

    const [notifications, setNotifications] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();

                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load notifications."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [setUnreadCount]);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const filteredNotifications = useMemo(() => {
        if (activeFilter === "unread") {
            return notifications.filter(
                (notification) => !notification.isRead
            );
        }

        return notifications;
    }, [activeFilter, notifications]);

    const getNotificationStyle = (type) => {
        switch (type) {
            case "new_proposal":
                return {
                    icon: "📄",
                    iconBackground: "bg-blue-100",
                    iconColor: "text-blue-700",
                };

            case "proposal_accepted":
                return {
                    icon: "✅",
                    iconBackground: "bg-emerald-100",
                    iconColor: "text-emerald-700",
                };

            case "proposal_rejected":
                return {
                    icon: "❌",
                    iconBackground: "bg-red-100",
                    iconColor: "text-red-700",
                };

            case "new_message":
                return {
                    icon: "💬",
                    iconBackground: "bg-indigo-100",
                    iconColor: "text-indigo-700",
                };

            case "project_completed":
                return {
                    icon: "🎉",
                    iconBackground: "bg-amber-100",
                    iconColor: "text-amber-700",
                };

            default:
                return {
                    icon: "🔔",
                    iconBackground: "bg-slate-100",
                    iconColor: "text-slate-700",
                };
        }
    };

    const formatRelativeTime = (date) => {
        if (!date) return "";

        const now = new Date();
        const notificationDate = new Date(date);

        const seconds = Math.round(
            (notificationDate.getTime() - now.getTime()) / 1000
        );

        const formatter = new Intl.RelativeTimeFormat(
            "en",
            {
                numeric: "auto",
            }
        );

        const absoluteSeconds = Math.abs(seconds);

        if (absoluteSeconds < 60) {
            return formatter.format(
                Math.round(seconds),
                "second"
            );
        }

        const minutes = Math.round(seconds / 60);

        if (Math.abs(minutes) < 60) {
            return formatter.format(minutes, "minute");
        }

        const hours = Math.round(minutes / 60);

        if (Math.abs(hours) < 24) {
            return formatter.format(hours, "hour");
        }

        const days = Math.round(hours / 24);

        if (Math.abs(days) < 30) {
            return formatter.format(days, "day");
        }

        const months = Math.round(days / 30);

        if (Math.abs(months) < 12) {
            return formatter.format(months, "month");
        }

        const years = Math.round(months / 12);

        return formatter.format(years, "year");
    };

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) =>
                            notification._id === id
                                ? {
                                    ...notification,
                                    isRead: true,
                                }
                                : notification
                    )
            );

            setUnreadCount((previousCount) =>
                Math.max(0, previousCount - 1)
            );
        } catch (updateError) {
            setError(
                updateError.message ||
                "Failed to update notification."
            );
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            isRead: true,
                        })
                    )
            );

            setUnreadCount(0);
        } catch (updateError) {
            setError(
                updateError.message ||
                "Failed to update notifications."
            );
        }
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Notifications
                            </h1>

                            <p className="mt-1 text-sm text-slate-600">
                                {unreadCount > 0
                                    ? `You have ${unreadCount} unread notification${unreadCount === 1
                                        ? ""
                                        : "s"
                                    }`
                                    : "You are all caught up."}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={
                                    handleMarkAllRead
                                }
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="mt-6 flex gap-2 border-b border-slate-200 pb-3">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveFilter("all")
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${activeFilter === "all"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setActiveFilter("unread")
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${activeFilter === "unread"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            Unread

                            {unreadCount > 0 && (
                                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <p className="mt-8 text-slate-600">
                            Loading notifications...
                        </p>
                    ) : filteredNotifications.length ===
                        0 ? (
                        <div className="mt-8 rounded-2xl bg-slate-50 p-10 text-center">
                            <h2 className="text-xl font-semibold text-slate-900">
                                {activeFilter === "unread"
                                    ? "No unread notifications"
                                    : "No notifications yet"}
                            </h2>

                            <p className="mt-2 text-slate-600">
                                You will see updates about
                                proposals, projects, and
                                messages here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4">
                            {filteredNotifications.map(
                                (notification) => {
                                    const notificationStyle =
                                        getNotificationStyle(
                                            notification.type
                                        );

                                    return (
                                        <article
                                            key={
                                                notification._id
                                            }
                                            className={`flex gap-4 rounded-2xl border p-5 ${notification.isRead
                                                    ? "border-slate-200 bg-white"
                                                    : "border-indigo-200 bg-indigo-50"
                                                }`}
                                        >
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${notificationStyle.iconBackground}`}
                                            >
                                                {
                                                    notificationStyle.icon
                                                }
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <h2 className="font-semibold text-slate-900">
                                                        {
                                                            notification.title
                                                        }
                                                    </h2>

                                                    <span className="text-xs text-slate-500">
                                                        {formatRelativeTime(
                                                            notification.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-slate-600">
                                                    {
                                                        notification.message
                                                    }
                                                </p>

                                                <div className="mt-3 flex items-center gap-4">
                                                    {notification.link && (
                                                        <Link
                                                            to={
                                                                notification.link
                                                            }
                                                            onClick={() =>
                                                                handleMarkRead(
                                                                    notification._id
                                                                )
                                                            }
                                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                        >
                                                            View →
                                                        </Link>
                                                    )}

                                                    {!notification.isRead && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleMarkRead(
                                                                    notification._id
                                                                )
                                                            }
                                                            className="text-sm font-medium text-slate-500 hover:text-slate-700"
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {!notification.isRead && (
                                                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                                            )}
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Notifications;