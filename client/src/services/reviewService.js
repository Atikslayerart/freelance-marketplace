const API_URL = "http://localhost:5000/api/reviews";

export const createReview = async (projectId, reviewData, token) => {
    const response = await fetch(`${API_URL}/project/${projectId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Review endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
    }

    return data;
};

export const getUserReviews = async (userId) => {
    const response = await fetch(`${API_URL}/user/${userId}`);

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Reviews endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load reviews.");
    }

    return data;
};