import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { deleteMasterlist } from "@/services/masterlistService"

const MasterlistDeleteDialog = ({
    open,
    onOpenChange,
    masterlist,
    onSuccess,
}) => {
    const queryClient = useQueryClient()

    const deleteMasterlistMutation = useMutation({
        mutationFn: deleteMasterlist,
        onSuccess: () => {
            toast.success("Masterlist entry deleted successfully.")
            queryClient.invalidateQueries({
                queryKey: ["masterlists"],
            })
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || "Failed to delete entry."
            )
        },
    })

    const handleDelete = () => {
        if (!masterlist?.id) return

        deleteMasterlistMutation.mutate(masterlist.id)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader className="gap-1">
                    <AlertDialogMedia>
                        <CircleAlert />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                        Delete Masterlist Entry
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-foreground">
                            {masterlist?.first_name} {masterlist?.last_name}
                        </span>{" "}
                        ({masterlist?.id_number}) from the masterlist? This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deleteMasterlistMutation.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMasterlistMutation.isPending}
                    >
                        {deleteMasterlistMutation.isPending ? (
                            <>
                                <Spinner />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default MasterlistDeleteDialog