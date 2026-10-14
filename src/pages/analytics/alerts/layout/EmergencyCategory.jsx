import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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
import { getEmergencyCategory } from "@/services/analyticsService"

const chartConfig = {
    alerts: { label: "Alerts" },
}

export function EmergencyCategory() {
    const [chartData, setChartData] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        getEmergencyCategory()
            .then((res) => setChartData(res.data))
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [])

    const totalAlerts = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.alerts, 0),
        [chartData]
    )

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Emergency Alerts by Category</CardTitle>
                <CardDescription>January - December {new Date().getFullYear()}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                        Loading…
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-6">
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-square max-h-[250px] w-[250px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="alerts"
                                    nameKey="category"
                                    innerRadius={60}
                                    strokeWidth={5}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {totalAlerts.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Alerts
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        <div className="flex flex-col gap-3">
                            {chartData.map((item) => (
                                <div
                                    key={item.category}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-sm"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span className="text-muted-foreground">
                                        {item.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default EmergencyCategory
