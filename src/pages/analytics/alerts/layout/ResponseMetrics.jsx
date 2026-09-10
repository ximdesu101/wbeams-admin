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
    CardContent
} from "@/components/ui/card";

const responseMetrics = [
    {
        title: "Average Response Time",
        value: "4m 32s",
        icon: Clock3,
    },
    {
        title: "Average Resolution Time",
        value: "18m 45s",
        icon: CheckCircle2,
    },
    {
        title: "Peak Concurrent Alerts",
        value: "12",
        icon: Radio,
    },
    {
        title: "Average Alert Delivery Time",
        value: "8.4s",
        icon: Zap,
    },
]

const ResponseMetrics = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Response & Delivery Performance</CardTitle>
                <CardDescription>Time-based performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {responseMetrics.map((metric) => {
                    const Icon = metric.icon
                    return (
                        <Card key={metric.title}>
                            <CardHeader>
                                <Icon className="mb-2 h-5 w-5 text-muted-foreground" />
                                <CardDescription>{metric.title}</CardDescription>
                                <CardTitle className="text-2xl">
                                    {metric.value}
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