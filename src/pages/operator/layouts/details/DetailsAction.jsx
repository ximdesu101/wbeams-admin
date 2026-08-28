import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RefreshCcwDot } from 'lucide-react';
import { toast } from "sonner";
import {
    resendOperatorInvitation,
    toggleOperatorStatus,
} from "@/services/operatorService";
import DeleteOperatorDialog from "./DeleteOperatorDialog";

const DetailsAction = ({ operator }) => {
    const queryClient = useQueryClient();
    const isActive = operator.status === "active";
    const isDeactivated = operator.status === "deactivated";
    const isInactiveOrExpired = operator.status === "inactive" || operator.status === "expired";

    const hasBeenActivatedByOperator = !!operator.activated_at;
    const canToggleStatus = hasBeenActivatedByOperator && (isActive || isDeactivated);

    const statusMutation = useMutation({
        mutationFn: (newStatus) => toggleOperatorStatus({ id: operator.operator_id, status: newStatus }),
        onSuccess: (_, newStatus) => {
            toast.success(newStatus === "active" ? "Operator account activated." : "Operator account deactivated.");
            queryClient.invalidateQueries({ queryKey: ["operator", operator.operator_id] });
            queryClient.invalidateQueries({ queryKey: ["operators"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update account status.");
        },
    });

    const resendMutation = useMutation({
        mutationFn: () => resendOperatorInvitation(operator.operator_id),
        onSuccess: () => {
            toast.success("Activation invitation resent.");
            queryClient.invalidateQueries({ queryKey: ["operator", operator.operator_id] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to resend activation email.");
        },
    });

    const handleToggle = (checked) => {
        if (!canToggleStatus) return;
        statusMutation.mutate(checked ? "active" : "deactivated");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account action</CardTitle>
                <CardDescription>Operator account management</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-semibold">
                                {isActive
                                    ? "Deactivate operator account"
                                    : isDeactivated
                                        ? "Activate operator account"
                                        : "Activate / Deactivate account"}
                            </h1>
                        </div>
                        <Switch
                            checked={isActive}
                            onCheckedChange={handleToggle}
                            disabled={!canToggleStatus || statusMutation.isPending}
                        />
                    </div>
                </div>
                <Separator className="my-1.5"/>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-semibold">Resend activation token</h1>
                    </div>
                    <Button
                        variant="secondary"
                        disabled={!isInactiveOrExpired || resendMutation.isPending}
                        onClick={() => resendMutation.mutate()}
                    >
                        <RefreshCcwDot />
                        Resend
                    </Button>
                </div>
                <Separator className="my-1.5"/>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-semibold">Delete operator account</h1>
                    </div>
                    <DeleteOperatorDialog operator={operator} />
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailsAction