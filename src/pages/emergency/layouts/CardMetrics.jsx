import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import {
    ChartBarStacked,
    BellElectric,
    RadioTower
} from "lucide-react";
import { normalizeList } from "@/lib/utils";
import { getEmergencyCategories } from "@/services/EmergencyCategoryService";
import { getAlertTypes } from "@/services/alertTypeService";

const CardMetrics = () => {
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["emergency-categories"],
        queryFn: getEmergencyCategories,
        staleTime: 30_000,
    });

    const { data: alertTypesData, isLoading: alertTypesLoading } = useQuery({
        queryKey: ["alert-types"],
        queryFn: getAlertTypes,
        staleTime: 30_000,
    });

    const categories = normalizeList(categoriesData);
    const alertTypes = normalizeList(alertTypesData);

    const activeCategories = categories.filter(
        (category) => category.is_active !== false
    );

    const coverage = categories.length
        ? Math.round((activeCategories.length / categories.length) * 100)
        : 0;

    const isLoading = categoriesLoading || alertTypesLoading;

    const metrics = [
        {
            id: 1,
            title: "Emergency Category",
            value: categories.length,
            icon: ChartBarStacked,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: 2,
            title: "Alert Types",
            value: alertTypes.length,
            icon: BellElectric,
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: 3,
            title: "Coverage",
            value: `${coverage}%`,
            icon: RadioTower,
            bgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
    ];

    return (
        <div className="grid grid-cols-3 auto-rows-min gap-4">
            {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                    <Card key={metric.id} className="flex-row gap-0 p-4">
                        <div
                            className={`flex h-16 w-16 items-center justify-center rounded-xl ${metric.bgColor}`}
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