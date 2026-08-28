import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Send,
    CircleCheck,
    CircleAlert,
} from "lucide-react";
import { getAlertStats } from "@/services/alertService";

const CardMetrics = () => {
    const { data } = useQuery({
        queryKey: ["alert-stats"],
        queryFn: getAlertStats,
        onError: () => {
            toast.error("Failed to load alert metrics.");
        },
    });

    const stats = data?.data ?? {};

    const metrics = [
        {
            id: 1,
            title: "Total Emergency Alerts Sent",
            value: stats.total ?? 0,
            icon: Send,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Acknowledged Alerts",
            value: stats.acknowledged ?? 0,
            icon: CircleAlert,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
        {
            id: 3,
            title: "Resolved Alerts",
            value: stats.resolved ?? 0,
            icon: CircleCheck,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 auto-rows-min gap-4">
            {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                    <Card key={metric.id} className="flex-row gap-0 p-4">
                        <div
                            className={`flex h-15 w-15 items-center justify-center rounded-xl ${metric.bgColor}`}
                        >
                            <Icon className={`h-8 w-8 ${metric.iconColor}`} />
                        </div>

                        <div className="flex-1">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-sm">
                                    {metric.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {metric.value}
                                </h1>
                            </CardContent>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default CardMetrics;