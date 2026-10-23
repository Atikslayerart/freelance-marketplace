const API_URL = "http://localhost:5000/api/notifications";

const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const getNotifications = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load notifications."
        );
    }

    return data;
};

export const markNotificationRead = async (id) => {
    const response = await fetch(
        `${API_URL}/${id}/read`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update notification."
        );
    }

    return data;
};

export const markAllNotificationsRead = async () => {
    const response = await fetch(
        `${API_URL}/read-all`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update notifications."
        );
    }

    return data;
};