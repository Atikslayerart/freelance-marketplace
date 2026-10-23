import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import sendContactEmail from "../utils/sendContactEmail.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
            });
        }

        if (message.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Message is too long. Please keep it under 2000 characters.",
            });
        }

        const contactMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message,
        });

        try {
            await sendContactEmail({
                name,
                email,
                subject,
                message,
            });
        } catch (emailError) {
            console.error(
                "Contact email failed:",
                emailError.message
            );
        }

        res.status(201).json({
            success: true,
            message: "Your message has been received.",
            data: contactMessage,
        });
    } catch (error) {
        console.error("Contact form error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send your message. Please try again.",
        });
    }
});

export default router;