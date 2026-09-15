"use client"

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs"
import {
    Headset,
    MonitorCog,
} from "lucide-react";
import { getFeedbackStats } from "@/services/feedbackService";

const chartConfig = {
    reviews: {
        label: "Reviews",
        color: "var(--chart-1)",
    },
}

const toChartData = (distribution = []) =>
    distribution.map((item) => ({
        rating: `${item.rating} ⭐`,
        reviews: item.reviews ?? 0,
    }));

const getAverageRating = (data) => {
    const totalReviews = data.reduce((sum, item) => sum + item.reviews, 0)
    if (totalReviews === 0) return "0.0"

    const totalRating = data.reduce((sum, item) => {
        const rating = Number(String(item.rating).charAt(0))
        return sum + rating * item.reviews
    }, 0)

    return (totalRating / totalReviews).toFixed(1)
}

const RatingBreakdown = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["feedback-stats"],
        queryFn: getFeedbackStats,
        staleTime: 30_000,
    });

    const stats = data?.data ?? {};
    const operatorData = toChartData(stats.operatorRatingDistribution);
    const systemData = toChartData(stats.systemRatingDistribution);

    const operatorAvg =
        stats.averageOperatorRating != null
            ? Number(stats.averageOperatorRating).toFixed(1)
            : getAverageRating(operatorData);
    const systemAvg =
        stats.averageSystemRating != null
            ? Number(stats.averageSystemRating).toFixed(1)
            : getAverageRating(systemData);

    const renderChart = (chartData, average) => (
        <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
                <div>
                    <div className="flex items-baseline gap-1">
                        <h1 className="text-4xl font-bold tracking-tight">
                            {isLoading ? "—" : average}
                        </h1>
                        <span className="text-sm text-muted-foreground">
                            / 5.0
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Average Rating
                    </p>
                </div>
            </div>

            <ChartContainer
                config={chartConfig}
                className="h-[150px] w-full"
            >
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                        left: 0,
                        right: 20,
                    }}
                >
                    <YAxis
                        dataKey="rating"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />

                    <XAxis
                        dataKey="reviews"
                        type="number"
                        hide
                    />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                hideLabel
                                formatter={(value) =>
                                    `${value} reviews`
                                }
                            />
                        }
                    />

                    <Bar
                        dataKey="reviews"
                        fill="var(--color-reviews)"
                        radius={5}
                    />
                </BarChart>
            </ChartContainer>
        </CardContent>
    );

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Rating Breakdown</CardTitle>
                <CardDescription>
                    Distribution of ratings from recipients
                </CardDescription>
            </CardHeader>

            <Tabs defaultValue="operator" className="w-full">
                <div className="px-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="operator" className="gap-2">
                            <Headset className="h-4 w-4" />
                            Operator
                        </TabsTrigger>
                        <TabsTrigger value="system" className="gap-2">
                            <MonitorCog className="h-4 w-4" />
                            System
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="operator">
                    {renderChart(operatorData, operatorAvg)}
                </TabsContent>

                <TabsContent value="system">
                    {renderChart(systemData, systemAvg)}
                </TabsContent>
            </Tabs>
        </Card>
    )
}

export default RatingBreakdown