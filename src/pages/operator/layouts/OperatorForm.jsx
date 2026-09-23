import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
  Save,
  UserRoundPen,
  IdCardLanyard,
  UserStar,
  Mail,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { operatorSchema } from "@/schemas/operatorSchema";
import { zodFieldValidator } from "@/lib/validators";
import { createOperator } from "@/services/operatorService";

const OperatorForm = ({ open, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();

  const createOperatorMutation = useMutation({
    mutationFn: (values) => createOperator(values),
    onSuccess: () => {
      toast.success("Operator account created. Invitation email sent.");
      queryClient.invalidateQueries({ queryKey: ["operators"] });
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
      operator_id: "",
      first_name: "",
      last_name: "",
      contact_number: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      const result = operatorSchema.safeParse(value);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          form.setFieldMeta(issue.path[0], (meta) => ({
            ...meta,
            errorMap: { onSubmit: issue.message },
          }));
        });
        return;
      }
      await createOperatorMutation.mutateAsync(result.data);
    },
  });

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
            <DialogTitle>Add Operator Account</DialogTitle>
            <DialogDescription>
              Enter the required information to create a new operator account. An invitation email will be sent automatically.
            </DialogDescription>
          </DialogHeader>
          <Separator className="my-3" />
          <FieldGroup>
            <form.Field
              name="operator_id"
              validators={{ onBlur: zodFieldValidator(operatorSchema.shape.operator_id) }}
            >
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel htmlFor={field.name}>Operator ID Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type="text"
                      placeholder="26-OP0001"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={createOperatorMutation.isPending}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <InputGroupAddon><IdCardLanyard /></InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                </Field>
              )}
            </form.Field>

            <FieldGroup className="grid grid-cols-2">
              <form.Field
                name="first_name"
                validators={{ onBlur: zodFieldValidator(operatorSchema.shape.first_name) }}
              >
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="text"
                        placeholder="Juan"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={createOperatorMutation.isPending}
                        aria-invalid={!field.state.meta.isValid}
                      />
                      <InputGroupAddon><UserRoundPen /></InputGroupAddon>
                    </InputGroup>
                    <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="last_name"
                validators={{ onBlur: zodFieldValidator(operatorSchema.shape.last_name) }}
              >
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="text"
                        placeholder="Dela Cruz"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={createOperatorMutation.isPending}
                        aria-invalid={!field.state.meta.isValid}
                      />
                      <InputGroupAddon><UserRoundPen /></InputGroupAddon>
                    </InputGroup>
                    <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <form.Field
              name="contact_number"
              validators={{ onBlur: zodFieldValidator(operatorSchema.shape.contact_number) }}
            >
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type="text"
                      inputMode="numeric"
                      placeholder="09123456789"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ""))}
                      disabled={createOperatorMutation.isPending}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <InputGroupAddon><UserStar /></InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onBlur: zodFieldValidator(operatorSchema.shape.email) }}
            >
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type="email"
                      placeholder="Juan.DelaCruz@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={createOperatorMutation.isPending}
                      aria-invalid={!field.state.meta.isValid}
                    />
                    <InputGroupAddon><Mail /></InputGroupAddon>
                  </InputGroup>
                  <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={createOperatorMutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || createOperatorMutation.isPending}
                >
                  {isSubmitting || createOperatorMutation.isPending ? (
                    <>
                      <Spinner />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      Create Account
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OperatorForm