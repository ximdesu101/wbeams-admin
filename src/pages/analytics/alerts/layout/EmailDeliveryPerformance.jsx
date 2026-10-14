import { useEffect, useState } from "react"
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
import { getEmailDeliveryPerformance } from "@/services/analyticsService"

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
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getEmailDeliveryPerformance()
            .then((res) => setChartData(res.data))
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [])

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
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            Loading…
                        </div>
                    ) : (
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
                            <Bar dataKey="sent"      fill="var(--color-sent)"      radius={4} />
                            <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
                            <Bar dataKey="failed"    fill="var(--color-failed)"    radius={4} />
                            <ChartLegend content={<ChartLegendContent />} />
                        </BarChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default EmailDeliveryPerformance
