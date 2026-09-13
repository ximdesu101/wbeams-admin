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

const CardMetrics = () => {
    const cardMetrics = [
        {
            id: 1,
            title: "Total Feedback",
            value: 128,
            description: "Across all categories",
            icon: MessageSquareMore,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Alert Feedback",
            value: 52,
            description: "85% helpful",
            icon: Bell,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: 3,
            title: "Operator Feedback",
            value: "4.9/5",
            description: "41 recipient feedback",
            icon: UserRoundCheck,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
        {
            id: 4,
            title: "System Feedback",
            value: "4.8/5",
            description: "35 recipient feedback",
            icon: MonitorCheck,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-4 auto-rows-min gap-4">
            {cardMetrics.map((data) => {
                const Icon = data.icon;

                return (
                    <Card key={data.id} className="flex-row gap-0 p-4">
                        <div className={`flex h-15 w-15 items-center justify-center rounded-xl ${data.bgColor}`}>
                            {Icon && <Icon className={`h-8 w-8 ${data.iconColor}`} />}
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
                                <p className="text-xs text-muted-foreground">
                                    {data.description}
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