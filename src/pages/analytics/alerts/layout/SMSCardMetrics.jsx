import {
    MessageSquare,
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
} from "@/components/ui/card";

const smsMetrics = [
    {
        title: "SMS Sent",
        value: "7,790",
        icon: MessageSquare,
    },
    {
        title: "SMS Delivered",
        value: "7,304",
        icon: CheckCircle2,
    },
    {
        title: "SMS Jobs",
        value: "7,825",
        icon: BriefcaseBusiness,
    },
    {
        title: "SMS Failed",
        value: "486",
        icon: XCircle,
    },
    {
        title: "Delivery Rate",
        value: "93.8%",
        icon: TrendingUp,
    },
    {
        title: "Failure Rate",
        value: "6.2%",
        icon: TrendingDown,
    },
]

const SMSCardMetrics = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {smsMetrics.map((metric) => {
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
        </div>
    )
}

export default SMSCardMetrics