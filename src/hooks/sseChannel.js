import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSSE } from "./useSSE";

const ADMIN_CHANNEL_QUERY_KEYS = {
    "emergency-categories": [["emergency-categories"], ["alert-types"]],
    "alert-types": [["alert-types"]],
    "access-requests": [["access-requests"], ["access-requests-pending-count"]],
    masterlist: [["masterlists"]],
    operators: [["operators"]],
    alerts: [["alerts"], ["alert-stats"], ["dispatch-stats"], ["recent-alerts"]],
    reports: [["reports"], ["report-stats"], ["recent-reports"]],
    recipients: [["recipients"]],
};

export function useAdminSSE({ enabled = true } = {}) {
    const queryClient = useQueryClient();

    useSSE({
        endpoint: "/admin/sse",
        getToken: () => localStorage.getItem("token"),
        enabled,
        onUpdate: ({ data }) => {
            const channel = data?.channel;
            if (!channel) return;

            const keys = ADMIN_CHANNEL_QUERY_KEYS[channel];
            if (!keys) return;

            keys.forEach((queryKey) => {
                queryClient.invalidateQueries({ queryKey });
            });
        },
        onError: (error) => {
            if (error.status === 401) {
                toast.error("Session expired. Please login again.");
            }
        },
    });
}

export function useAdminSSEReady(delayMs = 1200) {
    const [sseReady, setSseReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setSseReady(true), delayMs);
        return () => clearTimeout(timer);
    }, [delayMs]);

    useAdminSSE({ enabled: sseReady });
}