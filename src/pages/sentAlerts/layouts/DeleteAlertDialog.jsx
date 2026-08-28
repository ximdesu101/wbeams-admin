import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogMedia
} from "@/components/ui/alert-dialog";
import { 
    Trash2, 
    CircleAlert
} from "lucide-react";
import { deleteAlert } from "@/services/alertService";

const DeleteAlertDialog = ({ alert }) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteAlert(id),
        onSuccess: () => {
            toast.success("Sent alert deleted.");

            queryClient.invalidateQueries({ queryKey: ["alerts"] });
            queryClient.invalidateQueries({ queryKey: ["dispatch-stats"] });

            setOpen(false);
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || "Failed to delete alert."
            );
        },
    });

    const handleDelete = () => {
        if (!alert) return;
        deleteMutation.mutate(alert.id);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <AlertDialogMedia><CircleAlert className="text-destructive" /></AlertDialogMedia>
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete this sent alert?</AlertDialogTitle>
                    <AlertDialogDescription>
                        The alert <strong>{alert.EmergencyType}</strong> will be
                        permanently deleted. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAlertDialog;