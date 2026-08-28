import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    UsersRound,
    CircleCheck,
    CircleX,
} from "lucide-react";

const CardMetrics = ({ statusCounts, total }) => {
    const cardMetrics = [
        {
            id: 1,
            title: "Total Registered Users",
            value: total ?? 0,
            icon: UsersRound,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Active Accounts",
            value: statusCounts?.active ?? 0,
            icon: CircleCheck,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: 3,
            title: "Deactivated Accounts",
            value: statusCounts?.deactivated ?? 0,
            icon: CircleX,
            bgColor: "bg-red-100",
            iconColor: "text-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 auto-rows-min gap-4">
            {cardMetrics.map((data) => {
                const Icon = data.icon;
                return (
                    <Card key={data.id} className="flex-row gap-0 p-4">
                        <div
                            className={`flex h-15 w-15 items-center justify-center rounded-xl ${data.bgColor}`}
                        >
                            {Icon && (
                                <Icon className={`h-8 w-8 ${data.iconColor}`} />
                            )}
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
};

export default CardMetrics;
