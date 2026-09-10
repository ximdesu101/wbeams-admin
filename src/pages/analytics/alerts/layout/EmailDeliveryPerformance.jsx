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

export const description = "Email delivery performance"

const chartData = [
    { month: "January", sent: 380, delivered: 361, failed: 19 },
    { month: "February", sent: 425, delivered: 401, failed: 24 },
    { month: "March", sent: 490, delivered: 463, failed: 27 },
    { month: "April", sent: 455, delivered: 431, failed: 24 },
    { month: "May", sent: 540, delivered: 512, failed: 28 },
    { month: "June", sent: 585, delivered: 554, failed: 31 },
    { month: "July", sent: 560, delivered: 531, failed: 29 },
    { month: "August", sent: 635, delivered: 602, failed: 33 },
    { month: "September", sent: 680, delivered: 644, failed: 36 },
    { month: "October", sent: 650, delivered: 615, failed: 35 },
    { month: "November", sent: 735, delivered: 696, failed: 39 },
    { month: "December", sent: 810, delivered: 765, failed: 45 },
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

const EmailDeliveryPerformance = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Delivery Performance</CardTitle>
                <CardDescription>
                    Monthly email messages sent, delivered, and failed
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

export default EmailDeliveryPerformance