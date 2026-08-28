import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Send,
    MessageSquareWarning,
    ClockAlert
} from "lucide-react";
import { getAlertStats } from "@/services/alertService";
import { getReportStats } from "@/services/reportService";

function CardMetrics() {
    const { data: alertStats } = useQuery({
        queryKey: ["alert-stats"],
        queryFn: getAlertStats,
    });

    const { data: reportStats } = useQuery({
        queryKey: ["report-stats"],
        queryFn: getReportStats,
    });

    const counts = {
        alerts: alertStats?.data?.total ?? 0,
        reports: reportStats?.data?.total ?? 0,
        pendingReports: reportStats?.data?.pending ?? 0,
    };

    const metrics = [
        {
            id: 1,
            title: "Sent Alerts",
            value: counts.alerts,
            icon: Send,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Reported Alerts",
            value: counts.reports,
            icon: MessageSquareWarning,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: 3,
            title: "Pending Reports",
            value: counts.pendingReports,
            icon: ClockAlert,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 auto-rows-min gap-4">
            {metrics.map((data) => {
                const Icon = data.icon;

                return (
                    <Card key={data.id} className="flex-row gap-0 p-4">
                        <div
                            className={`flex h-15 w-15 items-center justify-center rounded-xl ${data.bgColor}`}
                        >
                            <Icon className={`h-8 w-8 ${data.iconColor}`} />
                        </div>

                        <div className="flex-1">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-sm">
                                    {data.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {data.value}
                                </h1>
                            </CardContent>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

export default CardMetrics;