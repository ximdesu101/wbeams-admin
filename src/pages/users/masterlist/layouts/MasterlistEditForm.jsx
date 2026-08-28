import { useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    Save,
    UserRoundPen,
    IdCardLanyard,
    GraduationCap,
    CalendarRange,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group"
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    input_class,
    icon_class,
} from "@/components/styles/constant/constants"
import { masterlistSchema } from "@/schemas/masterlistSchema"
import { zodFieldValidator } from "@/lib/validators"
import { updateMasterlist } from "@/services/masterlistService"

const MasterlistEditForm = ({
    open,
    onOpenChange,
    masterlist,
    onSuccess,
}) => {
    const queryClient = useQueryClient()

    const updateMasterlistMutation = useMutation({
        mutationFn: ({ id, payload }) => updateMasterlist(id, payload),

        onSuccess: () => {
            toast.success("Masterlist entry updated successfully.")

            queryClient.invalidateQueries({
                queryKey: ["masterlists"],
            })

            onOpenChange(false)
            onSuccess?.()
        },

        onError: (err) => {
            const errors = err.response?.data?.errors

            if (errors) {
                Object.entries(errors).forEach(([key, messages]) => {
                    form.setFieldMeta(key, (meta) => ({
                        ...meta,
                        errorMap: {
                            onSubmit: messages[0],
                        },
                    }))
                })

                return
            }

            toast.error(
                err.response?.data?.message || "Something went wrong."
            )
        },
    })

    const form = useForm({
        defaultValues: {
            id_number: "",
            first_name: "",
            last_name: "",
            role: "student",
            student_program: "",
            student_year: "",
        },

        onSubmit: async ({ value }) => {
            const result = masterlistSchema.safeParse(value)

            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    form.setFieldMeta(issue.path[0], (meta) => ({
                        ...meta,
                        errorMap: {
                            onSubmit: issue.message,
                        },
                    }))
                })

                return
            }

            const payload = {
                ...result.data,
                student_program:
                    result.data.role === "student"
                        ? result.data.student_program
                        : null,
                student_year:
                    result.data.role === "student"
                        ? result.data.student_year
                        : null,
            }

            await updateMasterlistMutation.mutateAsync({
                id: masterlist.id,
                payload,
            })
        },
    })

    useEffect(() => {
        if (!masterlist) return

        form.reset({
            id_number: masterlist.id_number || "",
            first_name: masterlist.first_name || "",
            last_name: masterlist.last_name || "",
            role: masterlist.role || "student",
            student_program: masterlist.student_program || "",
            student_year: masterlist.student_year || "",
        })
    }, [masterlist])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-sm"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        form.handleSubmit()
                    }}
                    noValidate
                >
                    <DialogHeader>
                        <DialogTitle>
                            Edit Masterlist Entry
                        </DialogTitle>

                        <DialogDescription>
                            Update the recipient's information below.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator className="my-3" />

                    <FieldGroup>
                        <form.Field
                            name="id_number"
                            validators={{
                                onBlur: zodFieldValidator(
                                    masterlistSchema.shape.id_number
                                ),
                            }}
                        >
                            {(field) => (
                                <Field
                                    data-invalid={!field.state.meta.isValid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        User ID
                                    </FieldLabel>

                                    <InputGroup>
                                        <InputGroupInput
                                            id={field.name}
                                            type="text"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value
                                                )
                                            }
                                            disabled={
                                                updateMasterlistMutation.isPending
                                            }
                                            aria-invalid={
                                                !field.state.meta.isValid
                                            }
                                        />

                                        <InputGroupAddon>
                                            <IdCardLanyard />
                                        </InputGroupAddon>
                                    </InputGroup>

                                    <FieldError
                                        errors={field.state.meta.errors.map(
                                            (message) => ({ message })
                                        )}
                                    />
                                </Field>
                            )}
                        </form.Field>

                        <FieldGroup className="grid grid-cols-2">
                            <form.Field
                                name="first_name"
                                validators={{
                                    onBlur: zodFieldValidator(
                                        masterlistSchema.shape.first_name
                                    ),
                                }}
                            >
                                {(field) => (
                                    <Field
                                        data-invalid={
                                            !field.state.meta.isValid
                                        }
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            First Name
                                        </FieldLabel>

                                        <InputGroup>
                                            <InputGroupInput
                                                id={field.name}
                                                type="text"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={
                                                    updateMasterlistMutation.isPending
                                                }
                                                aria-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            />

                                            <InputGroupAddon>
                                                <UserRoundPen />
                                            </InputGroupAddon>
                                        </InputGroup>

                                        <FieldError
                                            errors={field.state.meta.errors.map(
                                                (message) => ({ message })
                                            )}
                                        />
                                    </Field>
                                )}
                            </form.Field>

                            <form.Field
                                name="last_name"
                                validators={{
                                    onBlur: zodFieldValidator(
                                        masterlistSchema.shape.last_name
                                    ),
                                }}
                            >
                                {(field) => (
                                    <Field
                                        data-invalid={
                                            !field.state.meta.isValid
                                        }
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Last Name
                                        </FieldLabel>

                                        <InputGroup>
                                            <InputGroupInput
                                                id={field.name}
                                                type="text"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value
                                                    )
                                                }
                                                disabled={
                                                    updateMasterlistMutation.isPending
                                                }
                                                aria-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            />

                                            <InputGroupAddon>
                                                <UserRoundPen />
                                            </InputGroupAddon>
                                        </InputGroup>

                                        <FieldError
                                            errors={field.state.meta.errors.map(
                                                (message) => ({ message })
                                            )}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                        </FieldGroup>

                        <form.Field
                            name="role"
                            validators={{
                                onBlur: zodFieldValidator(
                                    masterlistSchema.shape.role
                                ),
                            }}
                            listeners={{
                                onChange: ({ value }) => {
                                    if (value !== "student") {
                                        form.setFieldValue(
                                            "student_program",
                                            ""
                                        )
                                        form.setFieldValue(
                                            "student_year",
                                            ""
                                        )

                                        form.setFieldMeta(
                                            "student_program",
                                            (meta) => ({
                                                ...meta,
                                                errorMap: {},
                                            })
                                        )

                                        form.setFieldMeta(
                                            "student_year",
                                            (meta) => ({
                                                ...meta,
                                                errorMap: {},
                                            })
                                        )
                                    }
                                },
                            }}
                        >
                            {(field) => (
                                <Field
                                    data-invalid={!field.state.meta.isValid}
                                >
                                    <Label>Select User Role</Label>

                                    <div className="rounded-md border border-border bg-secondary px-3 py-2">
                                        <RadioGroup
                                            value={field.state.value}
                                            onValueChange={field.handleChange}
                                            className="flex justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value="student"
                                                    id="edit-student"
                                                    disabled={
                                                        updateMasterlistMutation.isPending
                                                    }
                                                />
                                                <Label htmlFor="edit-student">
                                                    Student
                                                </Label>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value="faculty"
                                                    id="edit-faculty"
                                                    disabled={
                                                        updateMasterlistMutation.isPending
                                                    }
                                                />
                                                <Label htmlFor="edit-faculty">
                                                    Faculty
                                                </Label>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value="staff"
                                                    id="edit-staff"
                                                    disabled={
                                                        updateMasterlistMutation.isPending
                                                    }
                                                />
                                                <Label htmlFor="edit-staff">
                                                    Staff
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <FieldError
                                        errors={field.state.meta.errors.map(
                                            (message) => ({ message })
                                        )}
                                    />
                                </Field>
                            )}
                        </form.Field>

                        <form.Subscribe
                            selector={(state) => state.values.role}
                        >
                            {(role) => (
                                <>
                                    <form.Field
                                        name="student_program"
                                        validators={{
                                            onBlur: ({ value }) => {
                                                if (role !== "student") {
                                                    return undefined
                                                }

                                                return zodFieldValidator(
                                                    masterlistSchema.shape
                                                        .student_program
                                                )({ value })
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <Field
                                                data-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            >
                                                <FieldLabel>
                                                    Student Program
                                                </FieldLabel>

                                                <div className="relative">
                                                    <div className={icon_class}>
                                                        <GraduationCap className="h-5 w-5" />
                                                    </div>

                                                    <Select
                                                        disabled={
                                                            role !== "student" ||
                                                            updateMasterlistMutation.isPending
                                                        }
                                                        value={
                                                            field.state.value
                                                        }
                                                        onValueChange={
                                                            field.handleChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={input_class}
                                                            aria-invalid={
                                                                !field.state
                                                                    .meta
                                                                    .isValid
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select Student Program" />
                                                        </SelectTrigger>

                                                        <SelectContent position="popper">
                                                            <SelectGroup>
                                                                <SelectItem value="BSIT">
                                                                    Bachelor of
                                                                    Science in
                                                                    Information
                                                                    Technology
                                                                </SelectItem>
                                                                <SelectItem value="BSCrim">
                                                                    Bachelor of
                                                                    Science in
                                                                    Criminology
                                                                </SelectItem>
                                                                <SelectItem value="BEED">
                                                                    Bachelor of
                                                                    Elementary
                                                                    Education
                                                                </SelectItem>
                                                                <SelectItem value="BTLED">
                                                                    Bachelor of
                                                                    Technology
                                                                    and
                                                                    Livelihood
                                                                    Education
                                                                </SelectItem>
                                                                <SelectItem value="BSABE">
                                                                    Bachelor of
                                                                    Science in
                                                                    Agriculture
                                                                    and
                                                                    Biosystem
                                                                    Engineering
                                                                </SelectItem>
                                                                <SelectItem value="BSA">
                                                                    Bachelor of
                                                                    Science in
                                                                    Agriculture
                                                                </SelectItem>
                                                                <SelectItem value="BSF">
                                                                    Bachelor of
                                                                    Science in
                                                                    Forestry
                                                                </SelectItem>
                                                                <SelectItem value="BAT">
                                                                    Bachelor of
                                                                    Agricultural
                                                                    Technology
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <FieldError
                                                    errors={field.state.meta.errors.map(
                                                        (message) => ({
                                                            message,
                                                        })
                                                    )}
                                                />
                                            </Field>
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="student_year"
                                        validators={{
                                            onBlur: ({ value }) => {
                                                if (role !== "student") {
                                                    return undefined
                                                }

                                                return zodFieldValidator(
                                                    masterlistSchema.shape
                                                        .student_year
                                                )({ value })
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <Field
                                                data-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            >
                                                <FieldLabel>
                                                    Student Year
                                                </FieldLabel>

                                                <div className="relative">
                                                    <div className={icon_class}>
                                                        <CalendarRange className="h-5 w-5" />
                                                    </div>

                                                    <Select
                                                        disabled={
                                                            role !== "student" ||
                                                            updateMasterlistMutation.isPending
                                                        }
                                                        value={
                                                            field.state.value
                                                        }
                                                        onValueChange={
                                                            field.handleChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={input_class}
                                                            aria-invalid={
                                                                !field.state
                                                                    .meta
                                                                    .isValid
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select Student Year" />
                                                        </SelectTrigger>

                                                        <SelectContent position="popper">
                                                            <SelectGroup>
                                                                <SelectItem value="1st year">
                                                                    First Year
                                                                </SelectItem>
                                                                <SelectItem value="2nd year">
                                                                    Second Year
                                                                </SelectItem>
                                                                <SelectItem value="3rd year">
                                                                    Third Year
                                                                </SelectItem>
                                                                <SelectItem value="4th year">
                                                                    Fourth Year
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <FieldError
                                                    errors={field.state.meta.errors.map(
                                                        (message) => ({
                                                            message,
                                                        })
                                                    )}
                                                />
                                            </Field>
                                        )}
                                    </form.Field>
                                </>
                            )}
                        </form.Subscribe>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={
                                    updateMasterlistMutation.isPending
                                }
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    disabled={
                                        !canSubmit ||
                                        isSubmitting ||
                                        updateMasterlistMutation.isPending
                                    }
                                >
                                    {isSubmitting ||
                                    updateMasterlistMutation.isPending ? (
                                        <>
                                            <Spinner />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-3 w-3" />
                                            Save Changes
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

export default MasterlistEditForm