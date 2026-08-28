import api from "@/lib/axios";

export const getRecipients = async (page = 1, search = "", role = "") => {
    const response = await api.get("/admin/recipients", {
        params: { page, search, role },
    });
    return response.data;
};

export const toggleRecipientStatus = async ({ id, status }) => {
    const response = await api.patch(`/admin/recipients/${id}/status`, {
        status,
    });
    return response.data;
};

export const deleteRecipient = async (id) => {
    const response = await api.delete(`/admin/recipients/${id}`);
    return response.data;
};
