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

export const description = "Alert delivery by channel"

const chartData = [
    { month: "January", inApp: 70, sms: 45, email: 25 },
    { month: "February", inApp: 110, sms: 80, email: 65 },
    { month: "March", inApp: 95, sms: 120, email: 85 },
    { month: "April", inApp: 170, sms: 135, email: 115 },
    { month: "May", inApp: 145, sms: 180, email: 130 },
    { month: "June", inApp: 230, sms: 195, email: 175 },
    { month: "July", inApp: 205, sms: 250, email: 190 },
    { month: "August", inApp: 290, sms: 225, email: 240 },
    { month: "September", inApp: 565, sms: 310, email: 255 },
    { month: "October", inApp: 650, sms: 285, email: 300 },
    { month: "November", inApp: 725, sms: 370, email: 315 },
    { month: "December", inApp: 830, sms: 395, email: 360 },
]

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
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default AlertChannel