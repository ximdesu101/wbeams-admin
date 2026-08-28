import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon
} from "@/components/ui/input-group";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError
} from "@/components/ui/field";
import {
    RadioGroup,
    RadioGroupItem
} from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    IdCardLanyard,
    UserRoundPen,
    GraduationCap,
    CalendarRange,
    Save
} from "lucide-react";
import { input_class, icon_class } from "@/components/styles/constant/constants";
import { masterlistSchema } from "@/schemas/masterlistSchema";
import { zodFieldValidator } from "@/lib/validators";
import { createMasterlist } from "@/services/masterlistService";

const Manual = () => {
    const navigate = useNavigate();

    const createMasterlistMutation = useMutation({
        mutationFn: (payload) => createMasterlist(payload),
        onSuccess: () => {
            toast.success("User added to masterlist successfully.");
            form.reset();
            navigate("/user-masterlist");
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
            id_number: "",
            first_name: "",
            last_name: "",
            role: "student",
            student_program: "",
            student_year: "",
        },
        onSubmit: async ({ value }) => {
            const result = masterlistSchema.safeParse(value);
            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    form.setFieldMeta(issue.path[0], (meta) => ({
                        ...meta,
                        errorMap: { onSubmit: issue.message },
                    }));
                });
                return;
            }

            const payload = {
                ...result.data,
                student_program: result.data.role === "student" ? result.data.student_program : null,
                student_year: result.data.role === "student" ? result.data.student_year : null,
            };
            await createMasterlistMutation.mutateAsync(payload);
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    User Masterlist Form
                </CardTitle>
                <CardDescription>
                    Fill out the form below to add a new Users to the Masterlist Database.
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <FieldGroup>
                    <form.Field
                        name="id_number"
                        validators={{ onBlur: zodFieldValidator(masterlistSchema.shape.id_number) }}
                    >
                        {(field) => (
                            <Field data-invalid={!field.state.meta.isValid}>
                                <FieldLabel htmlFor={field.name}>User ID</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id={field.name}
                                        type="text"
                                        placeholder="19-sj00183"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        disabled={createMasterlistMutation.isPending}
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
                            validators={{ onBlur: zodFieldValidator(masterlistSchema.shape.first_name) }}
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
                                            disabled={createMasterlistMutation.isPending}
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
                            validators={{ onBlur: zodFieldValidator(masterlistSchema.shape.last_name) }}
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
                                            disabled={createMasterlistMutation.isPending}
                                            aria-invalid={!field.state.meta.isValid}
                                        />
                                        <InputGroupAddon><UserRoundPen /></InputGroupAddon>
                                    </InputGroup>
                                    <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                                </Field>
                            )}
                        </form.Field>
                    </FieldGroup>

                    {/* role field — on change, reset the dependent student_program/student_year fields */}
                    <form.Field
                        name="role"
                        validators={{ onBlur: zodFieldValidator(masterlistSchema.shape.role) }}
                        listeners={{
                            onChange: ({ value }) => {
                                if (value !== "student") {
                                    form.setFieldValue("student_program", "");
                                    form.setFieldValue("student_year", "");
                                    form.setFieldMeta("student_program", (meta) => ({ ...meta, errorMap: {} }));
                                    form.setFieldMeta("student_year", (meta) => ({ ...meta, errorMap: {} }));
                                }
                            },
                        }}
                    >
                        {(field) => (
                            <Field data-invalid={!field.state.meta.isValid}>
                                <Label>Select User Role</Label>
                                <div className="rounded-md border border-border bg-secondary px-3 py-2">
                                    <RadioGroup
                                        value={field.state.value}
                                        onValueChange={field.handleChange}
                                        className="flex justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="student" id="student" disabled={createMasterlistMutation.isPending} />
                                            <Label htmlFor="student">Student</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="faculty" id="faculty" disabled={createMasterlistMutation.isPending} />
                                            <Label htmlFor="faculty">Faculty</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="staff" id="staff" disabled={createMasterlistMutation.isPending} />
                                            <Label htmlFor="staff">Staff</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                            </Field>
                        )}
                    </form.Field>

                    <FieldGroup className="grid grid-cols-4">
                        <form.Subscribe selector={(state) => state.values.role}>
                            {(role) => (
                                <>
                                    <form.Field
                                        name="student_program"
                                        validators={{
                                            onBlur: ({ value }) => {
                                                if (role !== "student") return undefined;
                                                return zodFieldValidator(masterlistSchema.shape.student_program)({ value });
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <Field className="col-span-3" data-invalid={!field.state.meta.isValid}>
                                                <Label id="program">Student Program</Label>
                                                <div className="relative">
                                                    <div className={icon_class}><GraduationCap className="w-5 h-5" /></div>
                                                    <Select
                                                        disabled={role !== "student" || createMasterlistMutation.isPending}
                                                        value={field.state.value}
                                                        onValueChange={field.handleChange}
                                                    >
                                                        <SelectTrigger className={input_class} aria-invalid={!field.state.meta.isValid}>
                                                            <SelectValue placeholder="Select Student Program" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectGroup>
                                                                <SelectItem value="BSIT">Bachelor of Science in Information Technology</SelectItem>
                                                                <SelectItem value="BSCrim">Bachelor of Science in Criminology</SelectItem>
                                                                <SelectItem value="BEED">Bachelor of Elementary Education</SelectItem>
                                                                <SelectItem value="BTLED">Bachelor of Technology and Livelihood Education</SelectItem>
                                                                <SelectItem value="BSABE">Bachelor of Science in Agriculture and Biosystem Engineering</SelectItem>
                                                                <SelectItem value="BSA">Bachelor of Science in Agriculture</SelectItem>
                                                                <SelectItem value="BSF">Bachelor of Science in Forestry</SelectItem>
                                                                <SelectItem value="BAT">Bachelor of Agricultural Technology</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                                            </Field>
                                        )}
                                    </form.Field>

                                    <form.Field
                                        name="student_year"
                                        validators={{
                                            onBlur: ({ value }) => {
                                                if (role !== "student") return undefined;
                                                return zodFieldValidator(masterlistSchema.shape.student_year)({ value });
                                            },
                                        }}
                                    >
                                        {(field) => (
                                            <Field data-invalid={!field.state.meta.isValid}>
                                                <Label id="year">Student Year</Label>
                                                <div className="relative">
                                                    <div className={icon_class}><CalendarRange className="w-5 h-5" /></div>
                                                    <Select
                                                        disabled={role !== "student" || createMasterlistMutation.isPending}
                                                        value={field.state.value}
                                                        onValueChange={field.handleChange}
                                                    >
                                                        <SelectTrigger className={input_class} aria-invalid={!field.state.meta.isValid}>
                                                            <SelectValue placeholder="Select Student Year" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            <SelectGroup>
                                                                <SelectItem value="1st year">First Year</SelectItem>
                                                                <SelectItem value="2nd year">Second Year</SelectItem>
                                                                <SelectItem value="3rd year">Third Year</SelectItem>
                                                                <SelectItem value="4th year">Fourth Year</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FieldError errors={field.state.meta.errors.map((message) => ({ message }))} />
                                            </Field>
                                        )}
                                    </form.Field>
                                </>
                            )}
                        </form.Subscribe>
                    </FieldGroup>
                </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end mt-auto">
                <CardAction className="flex gap-1">
                    <Button variant="outline" onClick={() => navigate("/user-masterlist")} disabled={createMasterlistMutation.isPending}>
                        Cancel
                    </Button>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                        {([canSubmit, isSubmitting]) => (
                            <Button
                                className="gap-1"
                                onClick={form.handleSubmit}
                                disabled={!canSubmit || isSubmitting || createMasterlistMutation.isPending}
                            >
                                {isSubmitting || createMasterlistMutation.isPending ? (
                                    <>
                                        <Spinner />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Submit User
                                    </>
                                )}
                            </Button>
                        )}
                    </form.Subscribe>
                </CardAction>
            </CardFooter>
        </Card>
    );
};

export default Manual;