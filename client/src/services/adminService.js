import api from "./api.js";


// Dashboard stats
// GET /api/admin/stats
export const getAdminStats = async () => {
    const response = await api.get("/admin/stats");


    return response.data;
};


// Users
// GET /api/admin/users
export const getUsers = async (params = {}) => {
    const response = await api.get("/admin/users", {
        params,
    });


    return response.data;
};


// PATCH /api/admin/users/:id
export const updateUser = async (id, updates) => {
    const response = await api.patch(
        `/admin/users/${id}`,
        updates
    );


    return response.data;
};


// DELETE /api/admin/users/:id
export const deleteUser = async (id) => {
    const response = await api.delete(
        `/admin/users/${id}`
    );


    return response.data;
};


// Contact messages
// GET /api/admin/contact-messages
export const getContactMessages = async (params = {}) => {
    const response = await api.get("/admin/contact-messages", {
        params,
    });


    return response.data;
};


// PUT /api/admin/contact-messages/:id/status
export const updateContactMessageStatus = async (
    id,
    status
) => {
    const response = await api.put(
        `/admin/contact-messages/${id}/status`,
        { status }
    );


    return response.data;
};
// GET /api/admin/jobs
export const getAdminJobs = async (params = {}) => {
    const response = await api.get("/admin/jobs", {
        params,
    });

    return response.data;
};

// PATCH /api/admin/jobs/:id/status
export const updateJobStatus = async (id, status) => {
    const response = await api.patch(
        `/admin/jobs/${id}/status`,
        { status }
    );

    return response.data;
};

// DELETE /api/admin/jobs/:id
export const deleteJob = async (id) => {
    const response = await api.delete(
        `/admin/jobs/${id}`
    );

    return response.data;
};
// GET /api/admin/projects
export const getAdminProjects = async (params = {}) => {
    const response = await api.get("/admin/projects", {
        params,
    });

    return response.data;
};

// PATCH /api/admin/projects/:id/status
export const updateProjectStatus = async (id, status) => {
    const response = await api.patch(
        `/admin/projects/${id}/status`,
        { status }
    );

    return response.data;
};

// DELETE /api/admin/projects/:id
export const deleteProject = async (id) => {
    const response = await api.delete(
        `/admin/projects/${id}`
    );

    return response.data;
};