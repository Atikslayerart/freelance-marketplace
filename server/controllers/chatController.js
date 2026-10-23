import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/socketServer.js";

export const getOrCreateConversation = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const otherUserId = req.params.userId;

        if (
            currentUserId.toString() ===
            otherUserId.toString()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "You cannot start a conversation with yourself.",
            });
        }

        const otherUser = await User.findById(otherUserId);

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [currentUserId, otherUserId],
            },
        })
            .populate(
                "participants",
                "name role avatar"
            )
            .lean();

        if (!conversation) {
            const newConversation =
                await Conversation.create({
                    participants: [
                        currentUserId,
                        otherUserId,
                    ],
                });

            conversation = await Conversation.findById(
                newConversation._id
            )
                .populate(
                    "participants",
                    "name role avatar"
                )
                .lean();
        }

        return res.status(200).json({
            success: true,
            conversation,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to open conversation.",
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id,
        })
            .populate(
                "participants",
                "name role avatar"
            )
            .sort({ lastMessageAt: -1 });

        return res.status(200).json({
            success: true,
            count: conversations.length,
            conversations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to load conversations.",
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const conversationId =
            req.params.conversationId;

        const conversation =
            await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        const isParticipant =
            conversation.participants.some(
                (participant) =>
                    participant.toString() ===
                    req.user._id.toString()
            );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to view this conversation.",
            });
        }

        const messages = await Message.find({
            conversation: conversationId,
        })
            .populate(
                "sender",
                "name role avatar"
            )
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to load messages.",
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const conversationId =
            req.params.conversationId;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Message content is required.",
            });
        }

        const conversation =
            await Conversation.findById(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found.",
            });
        }

        const isParticipant =
            conversation.participants.some(
                (participant) =>
                    participant.toString() ===
                    req.user._id.toString()
            );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to send messages here.",
            });
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            content: content.trim(),
            readBy: [req.user._id],
        });

        const populatedMessage =
            await Message.findById(message._id).populate(
                "sender",
                "name role avatar"
            );

        conversation.lastMessage =
            populatedMessage.content;
        conversation.lastMessageAt = new Date();

        await conversation.save();

        const recipient =
            conversation.participants.find(
                (participant) =>
                    participant.toString() !==
                    req.user._id.toString()
            );

        const notificationMessage = `${req.user.name}: ${populatedMessage.content}`;

        await Notification.create({
            recipient,
            type: "new_message",
            title: "New message",
            message: notificationMessage,
            link: `/messages/${req.user._id}`,
        });

        const io = getIO();

        io.to(
            `conversation:${conversationId}`
        ).emit("messageReceived", {
            conversationId,
            message: populatedMessage,
        });

        if (recipient) {
            io.to(
                `user:${recipient.toString()}`
            ).emit("newMessage", {
                conversationId,
                message: populatedMessage,
            });

            io.to(
                `user:${recipient.toString()}`
            ).emit("notification", {
                type: "new_message",
                title: "New message",
                message: notificationMessage,
                link: `/messages/${req.user._id}`,
            });
        }

        return res.status(201).json({
            success: true,
            message: populatedMessage,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to send message.",
        });
    }
};