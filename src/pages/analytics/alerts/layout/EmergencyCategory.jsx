"use client"

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

export const description = "Emergency alerts by category"

const chartData = [
    { category: "Fire & Hazard", alerts: 275, fill: "var(--color-fire)" },
    { category: "Natural Disaster", alerts: 200, fill: "var(--color-natural)" },
    { category: "Security", alerts: 287, fill: "var(--color-security)" },
    { category: "Medical", alerts: 173, fill: "var(--color-medical)" },
    { category: "Infrastructure", alerts: 190, fill: "var(--color-infrastructure)" },
    { category: "Other", alerts: 120, fill: "var(--color-other)" },
]

const chartConfig = {
    alerts: {
        label: "Alerts",
    },
    fire: {
        label: "Fire & Hazard",
        color: "var(--chart-1)",
    },
    natural: {
        label: "Natural Disaster",
        color: "var(--chart-2)",
    },
    security: {
        label: "Security",
        color: "var(--chart-3)",
    },
    medical: {
        label: "Medical",
        color: "var(--chart-4)",
    },
    infrastructure: {
        label: "Infrastructure",
        color: "var(--chart-5)",
    },
    other: {
        label: "Other",
        color: "var(--chart-1)",
    },
}

export function EmergencyCategory() {
    const totalAlerts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.alerts, 0)
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Emergency Alerts by Category</CardTitle>
                <CardDescription>January - December 2026</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
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
            </CardContent>
        </Card>
    )
}

export default EmergencyCategory