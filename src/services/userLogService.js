import api from "@/lib/axios";

export const getUserLogs = async (page = 1, search = "", activity = "all", role = "all") => {
    const response = await api.get("/admin/user-logs", {
        params: { page, search, activity, role },
    });
    return response.data;
};
