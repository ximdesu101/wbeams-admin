import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import {
    MessageSquareMore,
    Bell,
    UserRoundCheck,
    MonitorCheck
} from "lucide-react";
import { getFeedbackStats } from "@/services/feedbackService";

const CardMetrics = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["feedback-stats"],
        queryFn: getFeedbackStats,
        staleTime: 30_000,
    });

    const stats = data?.data ?? {};

    const helpfulPercent =
        stats.alertFeedbackCount > 0
            ? Math.round(
                  ((stats.helpfulAlerts ?? 0) / stats.alertFeedbackCount) * 100
              )
            : stats.helpfulPercent ?? 0;

    const cardMetrics = [
        {
            id: 1,
            title: "Total Feedback",
            value: isLoading ? "—" : (stats.totalFeedback ?? 0),
            description: "Across all categories",
            icon: MessageSquareMore,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Alert Feedback",
            value: isLoading ? "—" : (stats.alertFeedbackCount ?? 0),
            description: `${helpfulPercent}% helpful`,
            icon: Bell,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: 3,
            title: "Operator Feedback",
            value: isLoading
                ? "—"
                : `${stats.averageOperatorRating ?? 0}/5`,
            description: `${stats.operatorFeedbackCount ?? 0} recipient feedback`,
            icon: UserRoundCheck,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
        {
            id: 4,
            title: "System Feedback",
            value: isLoading
                ? "—"
                : `${stats.averageSystemRating ?? 0}/5`,
            description: `${stats.systemFeedbackCount ?? 0} recipient feedback`,
            icon: MonitorCheck,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-4 auto-rows-min gap-4">
            {cardMetrics.map((item) => {
                const Icon = item.icon;

                return (
                    <Card key={item.id} className="flex-row gap-0 p-4">
                        <div
                            className={`flex h-15 w-15 items-center justify-center rounded-xl ${item.bgColor}`}
                        >
                            {Icon && (
                                <Icon className={`h-8 w-8 ${item.iconColor}`} />
                            )}
                        </div>

                        <div className="flex-1">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-sm">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {item.value}
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </CardContent>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default CardMetrics;