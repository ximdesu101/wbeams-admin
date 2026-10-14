import { useEffect, useState } from "react"
import {
    Mail,
    CheckCircle2,
    BriefcaseBusiness,
    XCircle,
    TrendingUp,
    TrendingDown,
} from "lucide-react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getEmailMetrics } from "@/services/analyticsService"

const metricConfig = [
    { key: "sent",          title: "Emails Sent",     icon: Mail            },
    { key: "delivered",     title: "Emails Delivered", icon: CheckCircle2   },
    { key: "jobs",          title: "Email Jobs",       icon: BriefcaseBusiness },
    { key: "failed",        title: "Emails Failed",    icon: XCircle        },
    { key: "delivery_rate", title: "Delivery Rate",    icon: TrendingUp, pct: true },
    { key: "failure_rate",  title: "Failure Rate",     icon: TrendingDown, pct: true },
]

const EmailCardMetrics = () => {
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getEmailMetrics()
            .then((res) => setMetrics(res.data))
            .catch(() => setMetrics(null))
            .finally(() => setLoading(false))
    }, [])

    const formatValue = (config) => {
        if (loading || metrics === null) return "—"
        const raw = metrics[config.key] ?? 0
        if (config.pct) return `${raw}%`
        return Number(raw).toLocaleString()
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {metricConfig.map((config) => {
                const Icon = config.icon
                return (
                    <Card key={config.title}>
                        <CardHeader>
                            <Icon className="mb-2 h-5 w-5 text-muted-foreground" />
                            <CardDescription>{config.title}</CardDescription>
                            <CardTitle className="text-2xl">
                                {formatValue(config)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                )
            })}
        </div>
    )
}

export default EmailCardMetrics
