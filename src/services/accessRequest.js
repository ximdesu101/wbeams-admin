import api from "@/lib/axios";

export const getAccessRequests = async (page = 1, search = "", status = "") => {
    const response = await api.get("/admin/access-requests", {
        params: { page, search, status },
    });
    return response.data;
};

export const getPendingAccessRequestCount = async () => {
    const response = await api.get("/admin/access-requests/pending-count");
    return response.data;
};

export const approveAccessRequest = async (id, data) => {
    const response = await api.patch(`/admin/access-requests/${id}/approve`, data);
    return response.data;
};

export const rejectAccessRequest = async (id) => {
    const response = await api.patch(`/admin/access-requests/${id}/reject`);
    return response.data;
};