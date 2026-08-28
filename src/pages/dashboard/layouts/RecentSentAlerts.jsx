import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty";
import {
    Send,
    User,
    MapPin,
    Clock,
    MessageSquareWarning
} from 'lucide-react';
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "@/services/alertService";

function RecentSentAlerts() {
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ["recent-alerts"],
        queryFn: () => getAlerts(1, "", { per_page: 2 }),
    });

    const recentAlerts = data?.data ?? [];

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <CardTitle className="flex gap-1 my-auto">
                    <Send className="w-4 h-4 my-auto" /> Recent Sent Alerts
                </CardTitle>
                <Button variant="outline" onClick={() => navigate("/test-route")}>All Sent Alerts</Button>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3">
                {recentAlerts.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia>
                                <MessageSquareWarning />
                            </EmptyMedia>
                            <EmptyTitle>No recent sent alerts</EmptyTitle>
                            <EmptyDescription>
                                New recent alerts sent by operator will appear here
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    recentAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-bold text-lg text-red-400">{alert.EmergencyType}</p>
                                <p className="flex gap-1 text-muted-foreground"><User className="w-3 h-3 my-auto" />{alert.reportedBy}</p>
                                <p className="flex gap-1 text-muted-foreground"><MapPin className="w-3 h-3 my-auto" />{alert.location} | <Clock className="w-3 h-3 my-auto" />{alert.date}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${alert.status === "active"
                                ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                                }`}>
                                {alert.status}
                            </span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default RecentSentAlerts;