import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    BellElectric,
    ClockAlert,
    CircleX,
    CircleCheck
} from "lucide-react";
import { getReportStats } from "@/services/reportService";

const CardMetrics = () => {
    const { data, isError } = useQuery({
        queryKey: ["report-stats"],
        queryFn: getReportStats,
        onError: () => toast.error("Failed to load report metrics."),
    });

    const stats = data?.data ?? {};

    const metrics = [
        {
            id: 1,
            title: "Total Reports",
            value: stats.total ?? 0,
            icon: BellElectric,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Resolved Reports",
            value: stats.resolved ?? 0,
            icon: CircleCheck,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: 3,
            title: "Pending Reports",
            value: stats.pending ?? 0,
            icon: ClockAlert,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
        {
            id: 4,
            title: "Rejected Reports",
            value: stats.rejected ?? 0,
            icon: CircleX,
            bgColor: "bg-red-100",
            iconColor: "text-red-600",
        },
    ];

    // Keep the same grid layout you already have (adjust cols if needed)
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-min gap-4">
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