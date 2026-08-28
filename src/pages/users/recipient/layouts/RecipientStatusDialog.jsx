import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ban, CheckCircle2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toggleRecipientStatus } from "@/services/recipientService";

const RecipientStatusDialog = ({ open, onOpenChange, recipient, onSuccess }) => {
    const isActive = (recipient?.status || "").toLowerCase() === "active";
    const nextStatus = isActive ? "deactivated" : "active";

    const statusMutation = useMutation({
        mutationFn: () =>
            toggleRecipientStatus({
                id: recipient.id,
                status: nextStatus,
            }),
        onSuccess: () => {
            toast.success(
                nextStatus === "active"
                    ? "Recipient account activated."
                    : "Recipient account deactivated."
            );
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message ||
                    "Failed to update account status."
            );
        },
    });

    const handleConfirm = () => {
        if (!recipient?.id) return;
        statusMutation.mutate();
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader className="gap-1">
                    <AlertDialogMedia>
                        {isActive ? (
                            <Ban className="text-destructive" />
                        ) : (
                            <CheckCircle2 className="text-green-600" />
                        )}
                    </AlertDialogMedia>
                    <AlertDialogTitle>
                        {isActive
                            ? "Deactivate recipient account?"
                            : "Activate recipient account?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {isActive ? (
                            <>
                                Deactivate{" "}
                                <span className="font-medium text-foreground">
                                    {recipient?.first_name}{" "}
                                    {recipient?.last_name}
                                </span>
                                ? They will no longer be able to log in.
                            </>
                        ) : (
                            <>
                                Activate{" "}
                                <span className="font-medium text-foreground">
                                    {recipient?.first_name}{" "}
                                    {recipient?.last_name}
                                </span>
                                ? They will be able to log in again.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={statusMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant={isActive ? "destructive" : "default"}
                        onClick={handleConfirm}
                        disabled={statusMutation.isPending}
                    >
                        {statusMutation.isPending ? (
                            <>
                                <Spinner className="mr-2" />
                                {isActive ? "Deactivating..." : "Activating..."}
                            </>
                        ) : isActive ? (
                            "Deactivate"
                        ) : (
                            "Activate"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RecipientStatusDialog;