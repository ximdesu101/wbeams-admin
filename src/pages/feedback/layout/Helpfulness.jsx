"use client"

import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import { getFeedbackStats } from "@/services/feedbackService";

const Helpfulness = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["feedback-stats"],
        queryFn: getFeedbackStats,
        staleTime: 30_000,
    });

    const stats = data?.data ?? {};
    const totalFeedback = stats.alertFeedbackCount ?? 0;
    const helpful = stats.helpfulAlerts ?? 0;
    const notHelpful = stats.notHelpfulAlerts ?? 0;

    const helpfulPercent =
        totalFeedback > 0
            ? Math.round((helpful / totalFeedback) * 100)
            : stats.helpfulPercent ?? 0;
    const notHelpfulPercent =
        totalFeedback > 0
            ? Math.round((notHelpful / totalFeedback) * 100)
            : stats.notHelpfulPercent ?? 0;

    const feedback = [
        {
            label: "Helpful",
            value: helpfulPercent,
            icon: ThumbsUp,
            color: "text-emerald-700",
            bgColor: "bg-emerald-100",
            rowColor: "bg-emerald-50",
        },
        {
            label: "Not Helpful",
            value: notHelpfulPercent,
            icon: ThumbsDown,
            color: "text-rose-500",
            bgColor: "bg-rose-100",
            rowColor: "bg-rose-50",
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Alert Helpfulness</CardTitle>
                <CardDescription>
                    Recipient responses to alerts
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {isLoading ? "—" : totalFeedback}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Total Alert Responses
                    </p>
                </div>

                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="bg-emerald-700 transition-all"
                        style={{ width: `${helpfulPercent}%` }}
                    />
                    <div
                        className="bg-rose-400 transition-all"
                        style={{ width: `${notHelpfulPercent}%` }}
                    />
                </div>

                <div className="space-y-3">
                    {feedback.map((item) => {
                        const Icon = item.icon

                        return (
                            <div
                                key={item.label}
                                className={`flex items-center justify-between rounded-lg px-3 py-3 ${item.rowColor}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bgColor}`}
                                    >
                                        <Icon
                                            className={`h-4 w-4 ${item.color}`}
                                        />
                                    </div>

                                    <span className="text-sm text-black font-medium ">
                                        {item.label}
                                    </span>
                                </div>

                                <span
                                    className={`text-lg font-bold ${item.color}`}
                                >
                                    {isLoading ? "—" : `${item.value}%`}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default Helpfulness