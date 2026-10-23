import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import {
    getMessages,
    getOrCreateConversation,
    sendMessage,
} from "../../services/chatService";

function Messages() {
    const { userId } = useParams();

    const { user } = useAuth();
    const { socket, isConnected } = useSocket();

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] =
        useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const currentUserId = String(
        user?._id || user?.id || ""
    );

    const otherParticipant =
        conversation?.participants?.find(
            (participant) =>
                String(
                    participant?._id ||
                    participant?.id ||
                    ""
                ) !== currentUserId
        );

    useEffect(() => {
        const openConversation = async () => {
            try {
                const conversationData =
                    await getOrCreateConversation(
                        userId
                    );

                setConversation(
                    conversationData.conversation
                );

                const messageData =
                    await getMessages(
                        conversationData
                            .conversation._id
                    );

                setMessages(
                    messageData.messages
                );
            } catch (fetchError) {
                setError(
                    fetchError.message ||
                    "Failed to open chat."
                );
            } finally {
                setIsLoading(false);
            }
        };

        openConversation();
    }, [userId]);

    useEffect(() => {
        if (
            !socket ||
            !conversation ||
            !currentUserId
        ) {
            return;
        }

        const conversationId = conversation._id;

        socket.emit(
            "joinConversation",
            conversationId
        );

        const handleMessageReceived = (data) => {
            if (
                data.conversationId !==
                conversationId
            ) {
                return;
            }

            const incomingMessage =
                data.message;

            if (!incomingMessage) return;

            const incomingSenderId = String(
                incomingMessage.sender?._id ||
                incomingMessage.sender
                    ?.id ||
                ""
            );

            const incomingMessageId = String(
                incomingMessage._id ||
                incomingMessage.id ||
                ""
            );

            if (
                incomingSenderId ===
                currentUserId
            ) {
                return;
            }

            setMessages(
                (previousMessages) => {
                    const messageExists =
                        previousMessages.some(
                            (message) =>
                                String(
                                    message._id ||
                                    message.id ||
                                    ""
                                ) ===
                                incomingMessageId
                        );

                    if (messageExists) {
                        return previousMessages;
                    }

                    return [
                        ...previousMessages,
                        incomingMessage,
                    ];
                }
            );
        };

        const handleUserTyping = (data) => {
            if (
                data.conversationId !==
                conversationId
            ) {
                return;
            }

            const typingUserId = String(
                data.userId || ""
            );

            if (
                typingUserId ===
                currentUserId
            ) {
                return;
            }

            setIsOtherUserTyping(true);

            if (
                typingTimeoutRef.current
            ) {
                clearTimeout(
                    typingTimeoutRef.current
                );
            }

            typingTimeoutRef.current =
                setTimeout(() => {
                    setIsOtherUserTyping(
                        false
                    );
                }, 3000);
        };

        const handleUserStoppedTyping = (
            data
        ) => {
            if (
                data.conversationId !==
                conversationId
            ) {
                return;
            }

            const typingUserId = String(
                data.userId || ""
            );

            if (
                typingUserId ===
                currentUserId
            ) {
                return;
            }

            setIsOtherUserTyping(false);
        };

        socket.on(
            "messageReceived",
            handleMessageReceived
        );

        socket.on(
            "userTyping",
            handleUserTyping
        );

        socket.on(
            "userStoppedTyping",
            handleUserStoppedTyping
        );

        return () => {
            socket.emit(
                "leaveConversation",
                conversationId
            );

            socket.off(
                "messageReceived",
                handleMessageReceived
            );

            socket.off(
                "userTyping",
                handleUserTyping
            );

            socket.off(
                "userStoppedTyping",
                handleUserStoppedTyping
            );
        };
    }, [socket, conversation, currentUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(
            {
                behavior: "smooth",
            }
        );
    }, [messages]);

    const handleEmojiClick = (emojiData) => {
        setNewMessage(
            (previousMessage) =>
                previousMessage +
                emojiData.emoji
        );
    };

    const handleTyping = () => {
        if (!socket || !conversation) return;

        socket.emit("typing", {
            conversationId: conversation._id,
        });

        if (typingTimeoutRef.current) {
            clearTimeout(
                typingTimeoutRef.current
            );
        }

        typingTimeoutRef.current =
            setTimeout(() => {
                socket.emit("stopTyping", {
                    conversationId:
                        conversation._id,
                });
            }, 2000);
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        const content = newMessage.trim();

        if (
            !content ||
            isSending ||
            !conversation
        ) {
            return;
        }

        setIsSending(true);

        try {
            const response =
                await sendMessage(
                    conversation._id,
                    content
                );

            const sentMessage =
                response.message;

            setMessages(
                (previousMessages) => {
                    const messageExists =
                        previousMessages.some(
                            (message) =>
                                String(
                                    message._id ||
                                    message.id ||
                                    ""
                                ) ===
                                String(
                                    sentMessage._id ||
                                    sentMessage.id ||
                                    ""
                                )
                        );

                    if (messageExists) {
                        return previousMessages;
                    }

                    return [
                        ...previousMessages,
                        sentMessage,
                    ];
                }
            );

            setNewMessage("");
            setShowEmojiPicker(false);
            setIsOtherUserTyping(false);

            if (socket && conversation) {
                socket.emit("stopTyping", {
                    conversationId:
                        conversation._id,
                });
            }
        } catch (sendError) {
            setError(
                sendError.message ||
                "Failed to send message."
            );
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                hour: "numeric",
                minute: "numeric",
            }
        ).format(new Date(date));
    };

    if (isLoading) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-3xl">
                    <p className="text-slate-600">
                        Loading chat...
                    </p>
                </div>
            </main>
        );
    }

    if (error || !conversation || !user) {
        return (
            <main className="min-h-[70vh] bg-slate-100 px-6 py-12">
                <div className="mx-auto max-w-3xl">
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error ||
                            "Unable to load chat."}
                    </div>

                    <Link
                        to="/messages"
                        className="mt-6 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                    >
                        ← Back to messages
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[80vh] bg-slate-100 px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">
                                {otherParticipant?.name ||
                                    "Chat"}
                            </h1>

                            <p className="text-sm text-slate-500">
                                {isOtherUserTyping
                                    ? `${otherParticipant?.name ||
                                    "User"
                                    } is typing...`
                                    : isConnected
                                        ? "Connected"
                                        : "Connecting..."}
                            </p>
                        </div>
                    </header>

                    <div className="h-[55vh] space-y-4 overflow-y-auto bg-slate-50 p-6">
                        {messages.length === 0 ? (
                            <p className="text-center text-sm text-slate-500">
                                No messages yet. Say
                                hello!
                            </p>
                        ) : (
                            messages.map(
                                (message) => {
                                    const messageSenderId =
                                        String(
                                            message
                                                .sender
                                                ?._id ||
                                            message
                                                .sender
                                                ?.id ||
                                            ""
                                        );

                                    const isOwnMessage =
                                        messageSenderId ===
                                        currentUserId;

                                    return (
                                        <div
                                            key={String(
                                                message._id ||
                                                message.id
                                            )}
                                            className={`flex ${isOwnMessage
                                                    ? "justify-end"
                                                    : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${isOwnMessage
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-white text-slate-800 shadow-sm"
                                                    }`}
                                            >
                                                <p className="text-sm">
                                                    {
                                                        message.content
                                                    }
                                                </p>

                                                <p
                                                    className={`mt-1 text-xs ${isOwnMessage
                                                            ? "text-indigo-100"
                                                            : "text-slate-500"
                                                        }`}
                                                >
                                                    {formatTime(
                                                        message.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}

                        <div
                            ref={messagesEndRef}
                        />
                    </div>

                    <div className="relative border-t border-slate-200 p-4">
                        {showEmojiPicker && (
                            <div className="absolute bottom-20 left-4 z-10">
                                <EmojiPicker
                                    onEmojiClick={
                                        handleEmojiClick
                                    }
                                    width={320}
                                    height={400}
                                    previewConfig={{
                                        showPreview:
                                            false,
                                    }}
                                />
                            </div>
                        )}

                        <form
                            onSubmit={
                                handleSendMessage
                            }
                            className="flex items-center gap-3"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setShowEmojiPicker(
                                        (
                                            previousState
                                        ) =>
                                            !previousState
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl hover:bg-slate-200"
                            >
                                😊
                            </button>

                            <input
                                type="text"
                                value={newMessage}
                                onChange={(
                                    event
                                ) => {
                                    setNewMessage(
                                        event
                                            .target
                                            .value
                                    );

                                    handleTyping();
                                }}
                                placeholder="Type a message..."
                                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                            />

                            <button
                                type="submit"
                                disabled={
                                    isSending ||
                                    !newMessage.trim()
                                }
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Messages;