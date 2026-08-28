import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { 
    CheckCircle2, 
    Mail, 
    Bell, 
    MessageSquare
} from "lucide-react";
import { getDispatchStats } from "@/services/alertService";

const CHANNEL_META = {
    email: {
        name: "Email",
        icon: Mail,
        iconBg: "bg-blue-500/15",
        iconColor: "text-blue-400",
        progressClass: "[&>div]:bg-blue-500",
    },
    web_push: {
        name: "In-app",
        icon: Bell,
        iconBg: "bg-violet-500/15",
        iconColor: "text-violet-400",
        progressClass: "[&>div]:bg-violet-400",
    },
    sms: {
        name: "SMS",
        icon: MessageSquare,
        iconBg: "bg-emerald-500/15",
        iconColor: "text-emerald-400",
        progressClass: "[&>div]:bg-emerald-400",
    },
};

const emptyChannels = [
    { key: "email", name: "Email", total: 0, delivered: 0, acked: 0, queued: 0 },
    { key: "web_push", name: "In-app", total: 0, delivered: 0, acked: 0, queued: 0 },
    { key: "sms", name: "SMS", total: 0, delivered: 0, acked: 0, queued: 0 },
];

const OverallSentAlerts = ({ className }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["dispatch-stats"],
        queryFn: getDispatchStats,
    });

    const channelsRaw = data?.data?.channels ?? emptyChannels;
    const totalMessages = data?.data?.total_messages ?? 0;

    const channels = channelsRaw.map((ch) => {
        const meta = CHANNEL_META[ch.key] ?? CHANNEL_META.email;
        return {
            ...meta,
            ...ch,
            name: ch.name || meta.name,
        };
    });

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 size={25} />
                    Overall Sent Alerts
                </CardTitle>
                <CardDescription>
                    {isLoading
                        ? "Loading..."
                        : isError
                            ? "Failed to load"
                            : `${totalMessages.toLocaleString()} total dispatches`}
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="grid grid-cols-3">
                    {channels.map((channel, index) => {
                        const Icon = channel.icon;
                        const successRate =
                            channel.total > 0
                                ? Math.round((channel.delivered / channel.total) * 100)
                                : 0;

                        return (
                            <div key={channel.key || channel.name} className="relative flex">
                                {index > 0 && (
                                    <Separator
                                        orientation="vertical"
                                        className="absolute left-0 top-0 h-full bg-white/5"
                                    />
                                )}

                                <div className={cn("w-full", index === 0 ? "pr-5" : index === 2 ? "pl-5" : "px-5")}>
                                    <div className="mb-4 flex items-center gap-2.5">
                                        <div
                                            className={cn(
                                                "flex size-8 items-center justify-center rounded-lg",
                                                channel.iconBg
                                            )}
                                        >
                                            <Icon className={cn("size-4", channel.iconColor)} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{channel.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {channel.total > 0 ? `${successRate}% dispatched` : "No dispatches"}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mb-3 text-3xl font-semibold tracking-tight">
                                        {channel.total.toLocaleString()}
                                    </p>

                                    <Progress
                                        value={channel.total > 0 ? successRate : 0}
                                        className={cn("mb-4 h-1 bg-white/10", channel.progressClass)}
                                    />

                                    <div className="flex items-center justify-between text-xs">
                                        <div>
                                            <p className="text-muted-foreground">queued</p>
                                            <p className="mt-0.5 font-medium text-white/60">
                                                {channel.queued ?? 0}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-muted-foreground">delivered</p>
                                            <p className="mt-0.5 font-medium text-emerald-400">
                                                {(channel.delivered ?? 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-muted-foreground">acked</p>
                                            <p className="mt-0.5 font-medium text-sky-400">
                                                {channel.acked ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default OverallSentAlerts