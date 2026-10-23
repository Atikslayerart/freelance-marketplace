import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({
            email: adminEmail,
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const admin = await User.create({
            name: "Platform Admin",
            email: adminEmail,
            password: adminPassword,
            role: "admin",
            isActive: true,
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Password:", adminPassword);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();