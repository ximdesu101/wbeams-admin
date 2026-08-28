import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { CircleAlert } from 'lucide-react';
import { deleteAlertType } from "@/services/alertTypeService";

const AlertDelete = ({ open, onOpenChange, deleteTarget, onSuccess }) => {
    const queryClient = useQueryClient();
    
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteAlertType(id),
        onSuccess: () => {
            toast.success("Alert type deleted.");
            queryClient.invalidateQueries({ queryKey: ["alert-types"] });
            queryClient.invalidateQueries({ queryKey: ["emergency-categories"] });
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete alert type.");
        },
    });

    const handleDelete = () => {
        if (deleteTarget?.id) {
            deleteMutation.mutate(deleteTarget.id);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader className="gap-1">
                    <AlertDialogMedia><CircleAlert/></AlertDialogMedia>
                    <AlertDialogTitle className="flex gap-1">
                        Delete Alert Type
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{deleteTarget?.name}</strong>? This action cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDelete;