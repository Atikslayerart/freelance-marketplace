const API_URL = "http://localhost:5000/api/chat";

const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const getOrCreateConversation = async (userId) => {
    const response = await fetch(
        `${API_URL}/conversations/${userId}`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to open conversation.");
    }

    return data;
};

export const getConversations = async () => {
    const response = await fetch(`${API_URL}/conversations`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load conversations.");
    }

    return data;
};

export const getMessages = async (conversationId) => {
    const response = await fetch(
        `${API_URL}/messages/${conversationId}`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load messages.");
    }

    return data;
};

export const sendMessage = async (conversationId, content) => {
    const response = await fetch(
        `${API_URL}/messages/${conversationId}`,
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ content }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
    }

    return data;
};