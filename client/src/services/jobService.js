const API_URL = "http://localhost:5000/api/jobs";

const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const createJob = async (jobData) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(jobData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create job."
        );
    }

    return data;
};

export const getJobs = async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.search) {
        queryParams.append("search", filters.search);
    }

    if (filters.category) {
        queryParams.append(
            "category",
            filters.category
        );
    }

    if (filters.budgetType) {
        queryParams.append(
            "budgetType",
            filters.budgetType
        );
    }

    if (filters.minBudget) {
        queryParams.append(
            "minBudget",
            filters.minBudget
        );
    }

    if (filters.maxBudget) {
        queryParams.append(
            "maxBudget",
            filters.maxBudget
        );
    }

    if (filters.sortBy) {
        queryParams.append(
            "sortBy",
            filters.sortBy
        );
    }

    const response = await fetch(
        `${API_URL}?${queryParams.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch jobs."
        );
    }

    return data;
};

export const getJobById = async (jobId) => {
    const response = await fetch(
        `${API_URL}/${jobId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch job."
        );
    }

    return data;
};

export const getMyJobs = async () => {
    const response = await fetch(
        `${API_URL}/my-jobs`,
        {
            method: "GET",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch your jobs."
        );
    }

    return data;
};

export const updateJob = async (
    jobId,
    jobData
) => {
    const response = await fetch(
        `${API_URL}/${jobId}`,
        {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(jobData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update job."
        );
    }

    return data;
};

export const deleteJob = async (jobId) => {
    const response = await fetch(
        `${API_URL}/${jobId}`,
        {
            method: "DELETE",
            headers: getAuthHeaders(),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to delete job."
        );
    }

    return data;
};