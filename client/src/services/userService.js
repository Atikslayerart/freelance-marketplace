const API_URL =
    "http://localhost:5000/api/users";

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

export const getFreelancers = async (
    filters = {}
) => {
    const queryParams =
        new URLSearchParams();

    if (filters.search) {
        queryParams.append(
            "search",
            filters.search
        );
    }

    if (filters.skill) {
        queryParams.append(
            "skill",
            filters.skill
        );
    }

    if (filters.minRate) {
        queryParams.append(
            "minRate",
            filters.minRate
        );
    }

    if (filters.maxRate) {
        queryParams.append(
            "maxRate",
            filters.maxRate
        );
    }

    if (filters.sortBy) {
        queryParams.append(
            "sortBy",
            filters.sortBy
        );
    }

    const response = await fetch(
        `${API_URL}/freelancers?${queryParams.toString()}`
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch freelancers."
        );
    }

    return data;
};

export const getUserById = async (
    userId
) => {
    const response = await fetch(
        `${API_URL}/${userId}`
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch user."
        );
    }

    return data;
};

export const getClientProfile =
    async () => {
        const response = await fetch(
            `${API_URL}/profile`,
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
                "Failed to fetch profile."
            );
        }

        return data.user;
    };

export const updateClientProfile =
    async (profileData) => {
        const response = await fetch(
            `${API_URL}/profile`,
            {
                method: "PUT",
                headers:
                    getAuthHeaders(),
                body: JSON.stringify(
                    profileData
                ),
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to update profile."
            );
        }

        return data;
    };