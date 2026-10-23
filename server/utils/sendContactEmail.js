import nodemailer from "nodemailer";

const sendContactEmail = async ({
    name,
    email,
    subject,
    message,
}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.SUPPORT_EMAIL,
        replyTo: email,
        subject: `New Contact Message: ${subject}`,
        html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    });
};

export default sendContactEmail;