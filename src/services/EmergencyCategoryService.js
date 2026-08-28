import api from "@/lib/axios";

export const createEmergencyCategory = async (data) => {
    const response = await api.post("/admin/emergency-categories", data);
    return response.data;
};

export const getEmergencyCategories = async () => {
    const response = await api.get("/admin/emergency-categories");
    return response.data;
};

export const updateEmergencyCategory = async (id, data) => {
    const response = await api.put(`/admin/emergency-categories/${id}`, data);
    return response.data;
};

export const deleteEmergencyCategory = async (id) => {
    const response = await api.delete(`/admin/emergency-categories/${id}`);
    return response.data;
};

export const toggleEmergencyCategoryStatus = async (id) => {
    const response = await api.patch(`/admin/emergency-categories/${id}/toggle-status`);
    return response.data;
};

export const getEmergencyCategory = async (id) => {
    const response = await api.get(`/admin/emergency-categories/${id}`);
    return response.data;
};