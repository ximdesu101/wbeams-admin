import api from "@/lib/axios";

/**
 * List feedback with optional filters.
 * @param {{ type?: string, search?: string, rating?: string|number, from?: string, to?: string }} params
 */
export const getFeedback = async (params = {}) => {
    const response = await api.get("/admin/feedback", { params });
    return response.data;
};

/**
 * Summary statistics for feedback metrics, charts, and helpfulness.
 */
export const getFeedbackStats = async () => {
    const response = await api.get("/admin/feedback/stats");
    return response.data;
};

/**
 * Single feedback detail by type and id.
 * @param {"alert"|"operator"|"system"} type
 * @param {number} id
 */
export const getFeedbackById = async (type, id) => {
    const response = await api.get(`/admin/feedback/${type}/${id}`);
    return response.data;
};