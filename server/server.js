import dotenv from "dotenv";

dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocketServer } from "./socket/socketServer.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const httpServer = http.createServer(app);

    initializeSocketServer(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();