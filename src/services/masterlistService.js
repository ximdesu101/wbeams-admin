import api from "@/lib/axios";

export const createMasterlist = async (data) => {
    const response = await api.post("/admin/masterlists", data);
    return response.data;
};

export const importMasterlist = async (file) => {
    const formData = new FormData();
    formData.append("file", file);


    const response = await api.post("/admin/masterlists/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getMasterlists = async (page = 1, search = "", role = "") => {
    const response = await api.get("/admin/masterlists", {
        params: { page, search, role },
    });
    return response.data;
};

export const getMasterlist = async (id) => {
    const response = await api.get(`/admin/masterlists/${id}`);
    return response.data;
};

export const updateMasterlist = async (id, data) => {
    const response = await api.put(`/admin/masterlists/${id}`, data);
    return response.data;
};

export const deleteMasterlist = async (id) => {
    const response = await api.delete(`/admin/masterlists/${id}`);
    return response.data;
};