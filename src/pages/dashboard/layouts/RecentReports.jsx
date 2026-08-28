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
    MessageSquareWarning,
    User,
    MapPin,
    Clock
} from "lucide-react";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/services/reportService";

function RecentReports() {
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ["recent-reports"],
        queryFn: () => getReports(1, "", { per_page: 2 }),
    });

    const recentAlerts = data?.data ?? [];

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <CardTitle className="flex gap-1 my-auto">
                    <MessageSquareWarning className="w-4 h-4 my-auto" />
                    Recent Reported Incidents
                </CardTitle>
                <Button variant="outline" onClick={() => navigate("/reported-incidents")}>
                    All Reports
                </Button>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-3">
                {recentAlerts.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia>
                                <MessageSquareWarning />
                            </EmptyMedia>
                            <EmptyTitle>No recent reported incidents</EmptyTitle>
                            <EmptyDescription>
                                New reported incidents sent by recipients will appear here
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    recentAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-center justify-between text-sm"
                        >
                            <div>
                                <p className="font-bold text-lg text-red-400">
                                    {alert.EmergencyType}
                                </p>
                                <p className="flex gap-1 text-muted-foreground">
                                    <User className="w-3 h-3 my-auto" />
                                    {alert.ReportedBy}
                                </p>
                                <p className="flex gap-1 text-muted-foreground">
                                    <MapPin className="w-3 h-3 my-auto" />
                                    {alert.location} |{" "}
                                    <Clock className="w-3 h-3 my-auto" />
                                    {alert.DateReported}
                                </p>
                            </div>
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${alert.status === "resolved"
                                        ? "bg-green-100 text-green-700"
                                        : alert.status === "acknowledged"
                                            ? "bg-blue-100 text-blue-700"
                                            : alert.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {alert.status}
                            </span>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default RecentReports;