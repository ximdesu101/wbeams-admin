"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs"
import {
    Headset,
    MonitorCog,
} from 'lucide-react';

const chartData = {
    operator: [
        { rating: "5 ⭐", reviews: 383 },
        { rating: "4 ⭐", reviews: 100 },
        { rating: "3 ⭐", reviews: 150 },
        { rating: "2 ⭐", reviews: 50 },
        { rating: "1 ⭐", reviews: 120 },
    ],
    system: [
        { rating: "5 ⭐", reviews: 350 },
        { rating: "4 ⭐", reviews: 120 },
        { rating: "3 ⭐", reviews: 90 },
        { rating: "2 ⭐", reviews: 45 },
        { rating: "1 ⭐", reviews: 30 },
    ],
}

const chartConfig = {
    reviews: {
        label: "Reviews",
        color: "var(--chart-1)",
    },
}

const getAverageRating = (data) => {
    const totalReviews = data.reduce((sum, item) => sum + item.reviews, 0)

    const totalRating = data.reduce((sum, item) => {
        const rating = Number(item.rating.charAt(0))
        return sum + rating * item.reviews
    }, 0)

    return (totalRating / totalReviews).toFixed(1)
}

const RatingBreakdown = () => {
    return (
        <Card>
            <Tabs defaultValue="operator">
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>Feedback Rating</CardTitle>
                            <CardDescription>
                                Distribution of feedback ratings
                            </CardDescription>
                        </div>
                        <TabsList>
                            <TabsTrigger value="operator">
                                <Headset />
                                Operator
                            </TabsTrigger>
                            <TabsTrigger value="system">
                                <MonitorCog />
                                System
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </CardHeader>

                <TabsContent value="operator">
                    <CardContent>
                        <div className="p-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-semibold">
                                    {getAverageRating(chartData.operator)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    / 5.0
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Average Rating
                            </p>
                        </div>

                        <ChartContainer
                            config={chartConfig}
                            className="h-[150px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData.operator}
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    right: 20,
                                }}
                            >
                                <YAxis
                                    dataKey="rating"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />

                                <XAxis
                                    dataKey="reviews"
                                    type="number"
                                    hide
                                />

                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            hideLabel
                                            formatter={(value) =>
                                                `${value} reviews`
                                            }
                                        />
                                    }
                                />

                                <Bar
                                    dataKey="reviews"
                                    fill="var(--color-reviews)"
                                    radius={5}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </TabsContent>

                <TabsContent value="system">
                    <CardContent>
                        <div className="p-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-semibold">
                                    {getAverageRating(chartData.system)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    / 5.0
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Average Rating
                            </p>
                        </div>

                        <ChartContainer
                            config={chartConfig}
                            className="h-[150px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData.system}
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    right: 20,
                                }}
                            >
                                <YAxis
                                    dataKey="rating"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />

                                <XAxis
                                    dataKey="reviews"
                                    type="number"
                                    hide
                                />

                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            hideLabel
                                            formatter={(value) =>
                                                `${value} reviews`
                                            }
                                        />
                                    }
                                />

                                <Bar
                                    dataKey="reviews"
                                    fill="var(--color-reviews)"
                                    radius={5}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    )
}

export default RatingBreakdown