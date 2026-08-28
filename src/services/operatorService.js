import api from "@/lib/axios";

export const createOperator = async (data) => {
  const response = await api.post("/admin/operators", data);
  return response.data;
};

export const getOperators = async (page = 1, search = "") => {
  const response = await api.get("/admin/operators", {
    params: { page, search },
  });
  return response.data;
};

export const getOperator = async (id) => {
  const response = await api.get(`/admin/operators/${id}`);
  return response.data;
};

export const resendOperatorInvitation = async (id) => {
  const response = await api.post(`/admin/operators/${id}/resend-invitation`);
  return response.data;
};

export const toggleOperatorStatus = async ({ id, status }) => {
  const response = await api.patch(`/admin/operators/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteOperator = async (id) => {
  const response = await api.delete(`/admin/operators/${id}`);
  return response.data;
};

export const getOperatorActivity = async (id) => {
  const response = await api.get(`/admin/operators/${id}/activity`);
  return response.data;
};

export const getOperatorDailyActivity = async (id) => {
  const response = await api.get(`/admin/operators/${id}/daily-activity`);
  return response.data;
};