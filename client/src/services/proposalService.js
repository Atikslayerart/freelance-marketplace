const API_URL = "http://localhost:5000/api/proposals";

export const submitProposal = async (jobId, proposalData, token) => {
    const response = await fetch(`${API_URL}/${jobId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(proposalData),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Proposal endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit proposal.");
    }

    return data;
};
export const getMyProposals = async (token) => {
    const response = await fetch(`${API_URL}/my-proposals`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("My proposals endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load proposals.");
    }

    return data;
};

export const getJobProposals = async (jobId, token) => {
    const response = await fetch(`${API_URL}/job/${jobId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Job proposals endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load proposals.");
    }

    return data;
};

export const updateProposalStatus = async (proposalId, status, token) => {
    const response = await fetch(`${API_URL}/${proposalId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Proposal status endpoint is not available.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update proposal.");
    }

    return data;
};