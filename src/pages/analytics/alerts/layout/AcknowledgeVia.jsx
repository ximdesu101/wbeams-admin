"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Acknowledged alerts by channel"

const chartData = [
    { channel: "In-App", acknowledged: 428, fill: "var(--chart-1)" },
    { channel: "Email", acknowledged: 315, fill: "var(--chart-2)" },
    { channel: "SMS", acknowledged: 267, fill: "var(--chart-3)" },
]

const chartConfig = {
    acknowledged: {
        label: "Acknowledged",
        color: "var(--chart-1)",
    },
}

const AcknowledgeVia = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Acknowledged Via</CardTitle>
                <CardDescription>
                    Total alerts acknowledged through each channel
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="channel"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="acknowledged"
                            radius={8}
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.channel}`}
                                    fill={entry.fill}
                                />
                            ))}
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default AcknowledgeVia