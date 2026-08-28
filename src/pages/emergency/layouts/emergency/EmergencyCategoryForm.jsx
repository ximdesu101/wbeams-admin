import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupTextarea
} from "@/components/ui/input-group";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError
} from "@/components/ui/field";
import { 
    PencilLine, 
    Save 
} from "lucide-react";
import { emergencyCategorySchema } from "@/schemas/emergencyCategorySchema";
import { zodFieldValidator } from "@/lib/validators";
import {
    createEmergencyCategory,
    updateEmergencyCategory,
} from "@/services/EmergencyCategoryService";

const EmergencyCategoryForm = ({ open, onOpenChange, category, onSuccess }) => {
    const queryClient = useQueryClient();
    const isEditing = Boolean(category);

    const saveCategoryMutation = useMutation({
        mutationFn: (values) =>
            isEditing
                ? updateEmergencyCategory(category.id, values)
                : createEmergencyCategory(values),
        onSuccess: () => {
            toast.success(
                isEditing
                    ? "Emergency category updated successfully."
                    : "Emergency category created successfully."
            );
            queryClient.invalidateQueries({ queryKey: ["emergency-categories"] });
            queryClient.invalidateQueries({ queryKey: ["alert-types"] });
            form.reset();
            onOpenChange(false);
            onSuccess?.();
        },
        onError: (err) => {
            const errors = err.response?.data?.errors;
            if (errors) {
                Object.entries(errors).forEach(([key, messages]) => {
                    form.setFieldMeta(key, (meta) => ({
                        ...meta,
                        errorMap: { onSubmit: messages[0] },
                    }));
                });
            } else {
                toast.error(err.response?.data?.message || "Something went wrong.");
            }
        },
    });

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
        onSubmit: async ({ value }) => {
            const result = emergencyCategorySchema.safeParse(value);
            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    form.setFieldMeta(issue.path[0], (meta) => ({
                        ...meta,
                        errorMap: { onSubmit: issue.message },
                    }));
                });
                return;
            }
            await saveCategoryMutation.mutateAsync(result.data);
        },
    });

    useEffect(() => {
        if (!open) return;

        form.reset({
            name: category?.name ?? "",
            description: category?.description ?? "",
        });
    }, [open, category, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-sm"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    noValidate
                >
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Edit Emergency Category" : "New Emergency Category"}
                        </DialogTitle>
                        <DialogDescription>
                            Categories group related alert types shown to responders and the public.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator className="my-3" />
                    <FieldGroup>
                        <form.Field
                            name="name"
                            validators={{
                                onBlur: zodFieldValidator(emergencyCategorySchema.shape.name),
                            }}
                        >
                            {(field) => (
                                <Field data-invalid={!field.state.meta.isValid}>
                                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            id={field.name}
                                            placeholder="Fire and Hazard"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            disabled={saveCategoryMutation.isPending}
                                            aria-invalid={!field.state.meta.isValid}
                                        />
                                        <InputGroupAddon>
                                            <PencilLine />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldError
                                        errors={field.state.meta.errors.map((message) => ({ message }))}
                                    />
                                </Field>
                            )}
                        </form.Field>
                        <form.Field name="description">
                            {(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            id={field.name}
                                            placeholder="What kind of alerts belong to this category?"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            disabled={saveCategoryMutation.isPending}
                                        />
                                    </InputGroup>
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={saveCategoryMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={
                                        !canSubmit ||
                                        isSubmitting ||
                                        saveCategoryMutation.isPending
                                    }
                                >
                                    {isSubmitting || saveCategoryMutation.isPending ? (
                                        <>
                                            <Spinner />
                                            Saving category...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-3 h-3" />
                                            Save category
                                        </>
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EmergencyCategoryForm;
