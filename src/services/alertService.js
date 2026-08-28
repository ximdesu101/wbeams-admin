import api from "@/lib/axios";

export const getAlerts = async (page = 1, search = "", extra = {}) => {
    const response = await api.get("/admin/alerts", {
        params: { page, search, ...extra },
    });
    return response.data;
};

export const getAlertStats = async () => {
    const response = await api.get("/admin/alerts/stats");
    return response.data;
};

export const deleteAlert = async (id) => {
    const response = await api.delete(`/admin/alerts/${id}`);
    return response.data;
};

export const getDispatchStats = async () => {
    const response = await api.get("/admin/alerts/dispatch-stats");
    return response.data;
};