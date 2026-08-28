import { useQuery } from "@tanstack/react-query";
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { getOperatorActivity } from "@/services/operatorService";

export const description = "Operator activity overview";

const chartConfig = {
    alertsSent: {
        label: "Alerts Sent",
        color: "var(--chart-1)",
    },
    alertsAcknowledged: {
        label: "Alerts Acknowledged",
        color: "var(--chart-2)",
    },
};

const defaultChartData = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(0, index).toLocaleString("en-US", { month: "long" }),
    alertsSent: 0,
    alertsAcknowledged: 0,
}));

const DetailsChart = ({ operatorId }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["operator-activity", operatorId],
        queryFn: () => getOperatorActivity(operatorId),
        enabled: !!operatorId,
    });

    const chartData = data?.data ?? defaultChartData;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Operator Activity</CardTitle>
                <CardDescription>
                    Alerts sent and acknowledgements for the current year
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[100px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            dataKey="alertsSent"
                            type="monotone"
                            stroke="var(--color-alertsSent)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="alertsAcknowledged"
                            type="monotone"
                            stroke="var(--color-alertsAcknowledged)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
                {isLoading && (
                    <p className="text-center text-sm text-muted-foreground mt-3">Loading chart data...</p>
                )}
                {isError && (
                    <p className="text-center text-sm text-destructive mt-3">Failed to load activity data.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailsChart
