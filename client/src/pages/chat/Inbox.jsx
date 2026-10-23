import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConversations } from "../../services/chatService";
import { useAuth } from "../../context/AuthContext";

function Inbox() {
    const { user } = useAuth();

    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations();

                setConversations(data.conversations);
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to load conversations."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const getOtherParticipant = (conversation) => {
        return conversation.participants?.find(
            (participant) => participant?._id !== user?._id
        );
    };

    return (
        <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold text-slate-900">
                    Messages
                </h1>

                <p className="mt-2 text-slate-600">
                    Your conversations with clients and freelancers.
                </p>

                {error && (
                    <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <p className="mt-8 text-slate-600">
                        Loading conversations...
                    </p>
                ) : conversations.length === 0 ? (
                    <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            No conversations yet
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Start a chat from a freelancer profile.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-4">
                        {conversations.map((conversation) => {
                            const otherParticipant =
                                getOtherParticipant(conversation);

                            return (
                                <Link
                                    key={conversation._id}
                                    to={`/messages/${otherParticipant?._id
                                        }`}
                                    className="block rounded-2xl bg-white p-5 shadow-sm hover:bg-slate-50"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="font-semibold text-slate-900">
                                                {otherParticipant?.name ||
                                                    "Unknown user"}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {conversation.lastMessage ||
                                                    "No messages yet."}
                                            </p>
                                        </div>

                                        <span className="text-xs text-slate-500">
                                            {conversation.lastMessageAt
                                                ? new Date(
                                                    conversation.lastMessageAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : ""}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Inbox;