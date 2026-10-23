import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import { getNotifications } from "../services/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const { socket } = useSocket();

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        const fetchUnreadCount = async () => {
            try {
                const data = await getNotifications();

                setUnreadCount(data.unreadCount);
            } catch (error) {
                console.error(
                    "Failed to load notifications:",
                    error.message
                );
            }
        };

        fetchUnreadCount();
    }, [user]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleNotification = () => {
            setUnreadCount(
                (previousCount) => previousCount + 1
            );
        };

        socket.on("notification", handleNotification);

        return () => {
            socket.off(
                "notification",
                handleNotification
            );
        };
    }, [socket, user]);

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                setUnreadCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider."
        );
    }

    return context;
};