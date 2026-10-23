const API_URL = "http://localhost:5000/api/projects";

export const getMyProjects = async (token) => {
    const response = await fetch(`${API_URL}/my-projects`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Projects endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load projects.");
    }

    return data;
};

export const updateProjectStatus = async (projectId, status, token) => {
    const response = await fetch(`${API_URL}/${projectId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Project status endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update project.");
    }

    return data;
};