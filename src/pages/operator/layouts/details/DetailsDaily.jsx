"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { getOperatorDailyActivity } from "@/services/operatorService"

const ACTIVITY_ROWS = [
    { key: "sentAlert", label: "Sent alert" },
    { key: "acknowledged", label: "Acknowledge" },
    { key: "resolved", label: "Resolved" },
    { key: "rejected", label: "Rejected" },
]

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Monday of the current week, at local midnight
const getCurrentWeekMonday = () => {
    const now = new Date()
    const mondayIndex = (now.getDay() + 6) % 7 // Sun=0..Sat=6 -> Mon=0..Sun=6
    const monday = new Date(now)
    monday.setDate(now.getDate() - mondayIndex)
    monday.setHours(0, 0, 0, 0)
    return monday
}

const buildEmptyWeek = () => {
    const monday = getCurrentWeekMonday()
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday)
        date.setDate(monday.getDate() + i)
        return {
            date: date.toISOString().split("T")[0],
            sentAlert: 0,
            acknowledged: 0,
            resolved: 0,
            rejected: 0,
        }
    })
}

const OperatorActivityMatrix = ({ operatorId }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["operator-daily-activity", operatorId],
        queryFn: () => getOperatorDailyActivity(operatorId),
        enabled: !!operatorId,
    })

    const week = useMemo(() => {
        if (data?.data?.length) {
            return data.data
        }
        return buildEmptyWeek()
    }, [data])

    const weekLabel = useMemo(() => {
        if (data?.meta?.week_start && data?.meta?.week_end) {
            const start = new Date(data.meta.week_start)
            const end = new Date(data.meta.week_end)
            const fmt = (d) =>
                d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            return `${fmt(start)} – ${fmt(end)}`
        }
        return null
    }, [data])

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Operators weekly activity</CardTitle>
                {weekLabel && (
                    <p className="text-xs text-muted-foreground">{weekLabel}</p>
                )}
            </CardHeader>
            <Separator />
            <CardContent>
                {isLoading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Loading activity...
                    </p>
                ) : isError ? (
                    <p className="text-sm text-destructive text-center py-4">
                        Failed to load daily activity.
                    </p>
                ) : (
                    <TooltipProvider delayDuration={100}>
                        <div
                            className="grid w-full gap-y-2 gap-x-1.5"
                            style={{ gridTemplateColumns: "auto repeat(7, minmax(0, 1fr))" }}
                        >
                            {ACTIVITY_ROWS.map((row) => (
                                <div key={row.key} className="contents">
                                    <span className="pr-3 text-xs text-muted-foreground whitespace-nowrap self-center">
                                        {row.label}
                                    </span>
                                    {week.map((day) => {
                                        const count = Number(day[row.key] ?? 0)
                                        const active = count > 0
                                        return (
                                            <div
                                                key={`${row.key}-${day.date}`}
                                                className="flex items-center justify-center h-4"
                                            >
                                                {active ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="size-1.5 rounded-full bg-foreground cursor-default" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="text-xs">
                                                            {row.label}: {count} —{" "}
                                                            {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                                                                weekday: "long",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : null}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}

                            {/* Day labels */}
                            <span />
                            {DAY_LABELS.map((label) => (
                                <span
                                    key={label}
                                    className="text-xs text-muted-foreground text-center pt-1 border-t"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </TooltipProvider>
                )}
            </CardContent>
        </Card>
    )
}

export default OperatorActivityMatrix
