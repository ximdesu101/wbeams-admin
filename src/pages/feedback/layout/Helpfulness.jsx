import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ThumbsUp, ThumbsDown } from "lucide-react"

const Helpfulness = () => {
    const totalFeedback = 684

    const feedback = [
        {
            label: "Helpful",
            value: 87,
            icon: ThumbsUp,
            color: "text-emerald-700",
            bgColor: "bg-emerald-100",
            rowColor: "bg-emerald-50",
        },
        {
            label: "Not Helpful",
            value: 13,
            icon: ThumbsDown,
            color: "text-red-500",
            bgColor: "bg-red-100",
            rowColor: "bg-red-50",
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alert Helpfulness</CardTitle>
                <CardDescription>
                    Recipient responses to alerts
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {totalFeedback}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Total Alert Responses
                    </p>
                </div>

                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="bg-emerald-700"
                        style={{ width: "87%" }}
                    />
                    <div
                        className="bg-rose-400"
                        style={{ width: "13%" }}
                    />
                </div>

                <div className="space-y-3">
                    {feedback.map((item) => {
                        const Icon = item.icon

                        return (
                            <div
                                key={item.label}
                                className={`flex items-center justify-between rounded-lg px-3 py-3 ${item.rowColor}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bgColor}`}
                                    >
                                        <Icon
                                            className={`h-4 w-4 ${item.color}`}
                                        />
                                    </div>

                                    <span className="text-sm text-black font-medium ">
                                        {item.label}
                                    </span>
                                </div>

                                <span
                                    className={`text-lg font-bold ${item.color}`}
                                >
                                    {item.value}%
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default Helpfulness