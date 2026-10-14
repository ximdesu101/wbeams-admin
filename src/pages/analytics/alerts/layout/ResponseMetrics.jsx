import { useEffect, useState } from "react"
import {
    Clock3,
    CheckCircle2,
    Radio,
    Zap,
} from "lucide-react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { getResponseMetrics } from "@/services/analyticsService"

const metricConfig = [
    { key: "avg_response_time",    title: "Average Response Time",       icon: Clock3       },
    { key: "avg_resolution_time",  title: "Average Resolution Time",     icon: CheckCircle2 },
    { key: "peak_concurrent_alerts", title: "Peak Concurrent Alerts",    icon: Radio        },
    { key: "avg_delivery_time",    title: "Average Alert Delivery Time", icon: Zap          },
]

const ResponseMetrics = () => {
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getResponseMetrics()
            .then((res) => setMetrics(res.data))
            .catch(() => setMetrics(null))
            .finally(() => setLoading(false))
    }, [])

    const getValue = (key) => {
        if (loading || metrics === null) return "—"
        return metrics[key] ?? "—"
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Response & Delivery Performance</CardTitle>
                <CardDescription>Time-based performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {metricConfig.map((config) => {
                    const Icon = config.icon
                    return (
                        <Card key={config.title}>
                            <CardHeader>
                                <Icon className="mb-2 h-5 w-5 text-muted-foreground" />
                                <CardDescription>{config.title}</CardDescription>
                                <CardTitle className="text-2xl">
                                    {getValue(config.key)}
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default ResponseMetrics
