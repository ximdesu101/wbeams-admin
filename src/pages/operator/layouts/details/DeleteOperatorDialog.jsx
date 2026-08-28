import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { deleteOperator } from "@/services/operatorService";

const DeleteOperatorDialog = ({ operator }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => deleteOperator(operator.operator_id),
        onSuccess: () => {
            toast.success("Operator account deleted.");
            queryClient.invalidateQueries({ queryKey: ["operators"] });
            setOpen(false);
            navigate("/operator");
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || "Failed to delete operator account."
            );
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteMutation.isPending}>
                    <Trash2 />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <AlertDialogMedia><CircleAlert className="text-destructive" /></AlertDialogMedia>
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete this operator account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <strong>{operator.first_name}</strong> <strong>{operator.last_name}'s</strong> operator
                        account will be permanently deleted. This cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteOperatorDialog;