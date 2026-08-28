import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
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
import { deleteRecipient } from "@/services/recipientService";

const RecipientDeleteDialog = ({ open, onOpenChange, recipient, onSuccess }) => {
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteRecipient(id),
        onSuccess: () => {
            toast.success("Recipient account deleted.");
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || "Failed to delete recipient."
            );
        },
    });

    const handleDelete = () => {
        if (!recipient?.id) return;
        deleteMutation.mutate(recipient.id);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader className="gap-1">
                    <AlertDialogMedia>
                        <CircleAlert className="text-destructive" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete recipient account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to permanently delete{" "}
                        <span className="font-medium text-foreground">
                            {recipient?.first_name} {recipient?.last_name}
                        </span>
                        {recipient?.id_number ? (
                            <> ({recipient.id_number})</>
                        ) : null}
                        ? This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <Spinner className="mr-2" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RecipientDeleteDialog;