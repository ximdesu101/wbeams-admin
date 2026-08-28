import api from "@/lib/axios";

export const createAlertType = async (data) => {
    const response = await api.post("/admin/alert-types", data);
    return response.data;
};

export const getAlertTypes = async (categoryId = null) => {
    const response = await api.get("/admin/alert-types", {
        params: categoryId ? { emergency_category_id: categoryId } : {},
    });
    return response.data;
};

export const updateAlertType = async (id, data) => {
    const response = await api.put(`/admin/alert-types/${id}`, data);
    return response.data;
};

export const deleteAlertType = async (id) => {
    const response = await api.delete(`/admin/alert-types/${id}`);
    return response.data;
};

export const toggleAlertTypeStatus = async (id) => {
    const response = await api.patch(`/admin/alert-types/${id}/toggle-status`);
    return response.data;
};

export const getAlertType = async (id) => {
    const response = await api.get(`/admin/alert-types/${id}`);
    return response.data;
};