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
} from "@/components/ui/card";

const emailMetrics = [
    {
        title: "Emails Sent",
        value: "7,290",
        icon: Mail,
    },
    {
        title: "Emails Delivered",
        value: "6,890",
        icon: CheckCircle2,
    },
    {
        title: "Email Jobs",
        value: "7,410",
        icon: BriefcaseBusiness,
    },
    {
        title: "Emails Failed",
        value: "400",
        icon: XCircle,
    },
    {
        title: "Delivery Rate",
        value: "94.5%",
        icon: TrendingUp,
    },
    {
        title: "Failure Rate",
        value: "5.5%",
        icon: TrendingDown,
    },
]

const EmailCardMetrics = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {emailMetrics.map((metric) => {
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

export default EmailCardMetrics