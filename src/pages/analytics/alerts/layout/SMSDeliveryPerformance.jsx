"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "SMS delivery performance"

const chartData = [
    { month: "January", sent: 420, delivered: 392, failed: 28 },
    { month: "February", sent: 510, delivered: 478, failed: 32 },
    { month: "March", sent: 465, delivered: 431, failed: 34 },
    { month: "April", sent: 580, delivered: 544, failed: 36 },
    { month: "May", sent: 625, delivered: 592, failed: 33 },
    { month: "June", sent: 570, delivered: 531, failed: 39 },
    { month: "July", sent: 690, delivered: 651, failed: 39 },
    { month: "August", sent: 645, delivered: 608, failed: 37 },
    { month: "September", sent: 735, delivered: 694, failed: 41 },
    { month: "October", sent: 780, delivered: 738, failed: 42 },
    { month: "November", sent: 850, delivered: 804, failed: 46 },
    { month: "December", sent: 920, delivered: 871, failed: 49 },
]

const chartConfig = {
    sent: {
        label: "Sent",
        color: "var(--chart-1)",
    },
    delivered: {
        label: "Delivered",
        color: "var(--chart-2)",
    },
    failed: {
        label: "Failed",
        color: "var(--chart-3)",
    },
}

const SMSDeliveryPerformance = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>SMS Delivery Performance</CardTitle>
                <CardDescription>
                    Monthly SMS messages sent, delivered, and failed
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="sent"
                            fill="var(--color-sent)"
                            radius={4}
                        />
                        <Bar
                            dataKey="delivered"
                            fill="var(--color-delivered)"
                            radius={4}
                        />
                        <Bar
                            dataKey="failed"
                            fill="var(--color-failed)"
                            radius={4}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default SMSDeliveryPerformance