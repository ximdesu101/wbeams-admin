import api from "@/lib/axios";

export const getReports = async (page = 1, search = "", extra = {}) => {
    const response = await api.get("/admin/reports", {
        params: { page, search, ...extra },
    });
    return response.data;
};

export const getReportStats = async () => {
    const response = await api.get("/admin/reports/stats");
    return response.data;
};