const API_URL =
    "http://localhost:5000/api/hire-requests";

const getAuthHeaders = () => {
    const token = localStorage.getItem(
        "authToken"
    );

    return {
        "Content-Type":
            "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const createHireRequest = async (
    hireData
) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(hireData),
    });

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to send hire invitation."
        );
    }

    return data;
};

export const getMyHireRequests =
    async () => {
        const response = await fetch(
            `${API_URL}/my-requests`,
            {
                method: "GET",
                headers:
                    getAuthHeaders(),
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to fetch hire requests."
            );
        }

        return data;
    };

export const updateHireRequestStatus =
    async (requestId, status) => {
        const response = await fetch(
            `${API_URL}/${requestId}/status`,
            {
                method: "PUT",
                headers:
                    getAuthHeaders(),
                body: JSON.stringify({
                    status,
                }),
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to update hire request."
            );
        }

        return data;
    };