import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user, token } = useAuth();

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const storedToken = token || localStorage.getItem("authToken");

        if (!user || !storedToken) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }

            return;
        }

        const newSocket = io("http://localhost:5000", {
            auth: {
                token: storedToken,
            },
        });

        newSocket.on("connect", () => {
            setIsConnected(true);
        });

        newSocket.on("connect_error", (error) => {
            console.error(
                "Socket connection error:",
                error.message
            );

            setIsConnected(false);
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user, token]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error(
            "useSocket must be used within a SocketProvider."
        );
    }

    return context;
};