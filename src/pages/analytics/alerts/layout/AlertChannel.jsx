import { useEffect, useState } from "react"
import { GitCommitVertical } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
import { getAlertChannel } from "@/services/analyticsService"

const chartConfig = {
    inApp: { label: "In-App", color: "var(--chart-1)" },
    sms: { label: "SMS", color: "var(--chart-2)" },
    email: { label: "Email", color: "var(--chart-3)" },
}

const channels = Object.keys(chartConfig)

const renderChannelDot =
    (channelKey) =>
    ({ cx, cy, payload }) => {
        if (cx == null || cy == null) {
            return null
        }

        const r = 16

        return (
            <GitCommitVertical
                key={`${channelKey}-${payload.month}`}
                x={cx - r / 2}
                y={cy - r / 2}
                width={r}
                height={r}
                fill="hsl(var(--background))"
                stroke={`var(--color-${channelKey})`}
            />
        )
    }

const AlertChannel = () => {
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAlertChannel()
            .then((res) => setChartData(res.data))
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alert Delivery by Channel</CardTitle>
                <CardDescription>
                    Showing alert deliveries for the last 12 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            Loading…
                        </div>
                    ) : (
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ left: 12, right: 12 }}
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
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            {channels.map((key) => (
                                <Line
                                    key={key}
                                    dataKey={key}
                                    type="natural"
                                    stroke={`var(--color-${key})`}
                                    strokeWidth={2}
                                    dot={renderChannelDot(key)}
                                />
                            ))}
                            <ChartLegend content={<ChartLegendContent />} />
                        </LineChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default AlertChannel
