import { useEffect, useState } from "react"
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
import { getAcknowledgeVia } from "@/services/analyticsService"

const chartConfig = {
    acknowledged: {
        label: "Acknowledged",
        color: "var(--chart-1)",
    },
}

const AcknowledgeVia = () => {
    const [chartData, setChartData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAcknowledgeVia()
            .then((res) => setChartData(res.data))
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [])

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
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            Loading…
                        </div>
                    ) : (
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{ top: 20 }}
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
                            <Bar dataKey="acknowledged" radius={8}>
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
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default AcknowledgeVia
