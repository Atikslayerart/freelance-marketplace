import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

const connectedUsers = new Map();

export const initializeSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error(
                        "Authentication token missing."
                    )
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.userId =
                decoded.id ||
                decoded.userId ||
                decoded._id;

            if (!socket.userId) {
                return next(
                    new Error(
                        "User ID missing in token."
                    )
                );
            }

            next();
        } catch (error) {
            console.error(
                "Socket authentication error:",
                error.message
            );

            next(
                new Error(
                    "Authentication failed."
                )
            );
        }
    });

    io.on("connection", (socket) => {
        const userId =
            socket.userId.toString();

        connectedUsers.set(
            userId,
            socket.id
        );

        socket.join(`user:${userId}`);

        console.log(
            `Socket connected: ${userId} - ${socket.id}`
        );

        socket.emit("connected", {
            userId,
        });

        socket.on(
            "joinConversation",
            (conversationId) => {
                socket.join(
                    `conversation:${conversationId}`
                );

                console.log(
                    `User ${userId} joined conversation ${conversationId}`
                );
            }
        );

        socket.on(
            "leaveConversation",
            (conversationId) => {
                socket.leave(
                    `conversation:${conversationId}`
                );

                console.log(
                    `User ${userId} left conversation ${conversationId}`
                );
            }
        );

        socket.on(
            "sendMessage",
            ({
                conversationId,
                message,
            }) => {
                io.to(
                    `conversation:${conversationId}`
                ).emit("messageReceived", {
                    conversationId,
                    message,
                });
            }
        );

        socket.on(
            "typing",
            ({ conversationId }) => {
                socket
                    .to(
                        `conversation:${conversationId}`
                    )
                    .emit("userTyping", {
                        conversationId,
                        userId,
                    });
            }
        );

        socket.on(
            "stopTyping",
            ({ conversationId }) => {
                socket
                    .to(
                        `conversation:${conversationId}`
                    )
                    .emit(
                        "userStoppedTyping",
                        {
                            conversationId,
                            userId,
                        }
                    );
            }
        );

        socket.on("disconnect", () => {
            connectedUsers.delete(userId);

            console.log(
                `Socket disconnected: ${userId}`
            );
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error(
            "Socket.IO is not initialized."
        );
    }

    return io;
};

export const getConnectedUsers = () =>
    connectedUsers;