import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    Siren,
    CircleAlert
} from "lucide-react";
import { deleteEmergencyCategory } from "@/services/EmergencyCategoryService";

const EmergencyCategoryDeleteDialog = ({ trigger, category, onSuccess }) => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteEmergencyCategory(id),
        onSuccess: (_, id) => {
            toast.success("Category deleted.");
            queryClient.invalidateQueries({ queryKey: ["emergency-categories"] });
            queryClient.invalidateQueries({ queryKey: ["alert-types"] });
            onSuccess?.(id);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete category.");
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader className="gap-1">
                    <AlertDialogMedia>
                        <AlertDialogMedia><CircleAlert className="text-destructive" /></AlertDialogMedia>
                    </AlertDialogMedia>
                    <AlertDialogTitle className="flex gap-1">
                        Delete Emergency Category
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{category?.name}</strong>? This will also remove
                        all associated alert types and cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(category.id)}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EmergencyCategoryDeleteDialog;