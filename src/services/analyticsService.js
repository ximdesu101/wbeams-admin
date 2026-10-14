import api from "@/lib/axios";

const base = "/admin/analytics";

export const getAlertChannel = async () => {
    const response = await api.get(`${base}/alert-channel`);
    return response.data;
};

export const getAcknowledgeVia = async () => {
    const response = await api.get(`${base}/acknowledge-via`);
    return response.data;
};

export const getEmailMetrics = async () => {
    const response = await api.get(`${base}/email-metrics`);
    return response.data;
};

export const getEmailDeliveryPerformance = async () => {
    const response = await api.get(`${base}/email-delivery-performance`);
    return response.data;
};

export const getSmsMetrics = async () => {
    const response = await api.get(`${base}/sms-metrics`);
    return response.data;
};

export const getSmsDeliveryPerformance = async () => {
    const response = await api.get(`${base}/sms-delivery-performance`);
    return response.data;
};

export const getEmergencyCategory = async () => {
    const response = await api.get(`${base}/emergency-category`);
    return response.data;
};

export const getResponseMetrics = async () => {
    const response = await api.get(`${base}/response-metrics`);
    return response.data;
};

export const getGeographicSummary = async () => {
    const response = await api.get(`${base}/geographic-summary`);
    return response.data;
};
