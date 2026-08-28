import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";
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
    Siren,
    Flame,
    CloudLightning,
    HeartPulse,
    ShieldAlert,
    Zap,
    Building2,
    Trees,
    Wind,
    Waves,
    Mountain,
    Activity,
    Bandage,
    FlaskConical,
    Skull,
    Bomb,
    Cloud,
    Droplets,
    Plug,
    Check,
    Plus,
    Trash2,
    GripVertical,
    ArrowLeft,
} from "lucide-react";
import { alertTypeSchema } from "@/schemas/alertTypeSchema";
import { zodFieldValidator } from "@/lib/validators";
import { normalizeList } from "@/lib/utils";
import { getEmergencyCategories } from "@/services/EmergencyCategoryService";
import { createAlertType, updateAlertType } from "@/services/alertTypeService";

// ── Icon / colour maps ──────────────────────────────────────────────────────
const iconMap = {
    Flame,
    CloudLightning,
    HeartPulse,
    ShieldAlert,
    Zap,
    Building2,
    Trees,
    Wind,
    Waves,
    Mountain,
    Activity,
    Bandage,
    FlaskConical,
    Skull,
    Bomb,
    Cloud,
    Droplets,
    Plug,
};

const colorMap = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#0ea5e9",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#64748b",
    "#0f172a",
];

const AlertForm = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const queryClient = useQueryClient();

    const editingAlertType = state?.alertType ?? null;
    const preselectedCategoryId = state?.categoryId
        ? String(state.categoryId)
        : null;
    const isEditing = Boolean(editingAlertType);

    const iconOptions = Object.keys(iconMap);
    const [selectedIcon, setSelectedIcon] = useState(
        editingAlertType?.icon ?? iconOptions[0]
    );
    const [selectedColor, setSelectedColor] = useState(
        editingAlertType?.color ?? colorMap[0]
    );

    const [instructions, setInstructions] = useState(() => {
        const saved = editingAlertType?.response_instructions;
        return Array.isArray(saved) && saved.length > 0 ? saved : [""];
    });

    const updateInstruction = (index, value) =>
        setInstructions((prev) =>
            prev.map((item, i) => (i === index ? value : item))
        );
    const addInstruction = () =>
        setInstructions((prev) => [...prev, ""]);
    const removeInstruction = (index) =>
        setInstructions((prev) =>
            prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
        );

    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["emergency-categories"],
        queryFn: getEmergencyCategories,
    });
    const categories = normalizeList(categoriesData).filter(
        (c) => c.is_active !== false
    );

    const saveAlertTypeMutation = useMutation({
        mutationFn: (values) =>
            isEditing
                ? updateAlertType(editingAlertType.id, values)
                : createAlertType(values),
        onSuccess: () => {
            toast.success(
                isEditing
                    ? "Alert type updated successfully."
                    : "Alert type created successfully."
            );
            queryClient.invalidateQueries({ queryKey: ["alert-types"] });
            queryClient.invalidateQueries({ queryKey: ["emergency-categories"] });
            navigate("/emergency");
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
                toast.error(
                    err.response?.data?.message || "Something went wrong."
                );
            }
        },
    });

    const form = useForm({
        defaultValues: {
            emergency_category_id: editingAlertType
                ? String(editingAlertType.emergency_category_id)
                : (preselectedCategoryId ?? ""),
            name: editingAlertType?.name ?? "",
            description: editingAlertType?.description ?? "",
            severity: editingAlertType?.severity ?? "low",
        },
        onSubmit: async ({ value }) => {
            const payload = {
                ...value,
                icon: selectedIcon,
                color: selectedColor,
                response_instructions: instructions.filter((s) => s.trim() !== ""),
            };

            const result = alertTypeSchema.safeParse(payload);
            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    form.setFieldMeta(issue.path[0], (meta) => ({
                        ...meta,
                        errorMap: { onSubmit: issue.message },
                    }));
                });
                return;
            }
            await saveAlertTypeMutation.mutateAsync(result.data);
        },
    });

    useEffect(() => {
        if (editingAlertType?.icon) setSelectedIcon(editingAlertType.icon);
        if (editingAlertType?.color) setSelectedColor(editingAlertType.color);
    }, [editingAlertType]);

    const isPending = saveAlertTypeMutation.isPending;

    const PreviewIcon = iconMap[selectedIcon] ?? Siren;

    return (
        <Card>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                noValidate
            >
                <CardHeader>
                    <CardTitle>
                        {isEditing ? "Edit Alert Type" : "New Alert Type"}
                    </CardTitle>
                    <CardDescription>
                        Alert types are the specific incidents responders can raise
                    </CardDescription>
                </CardHeader>
                <Separator className="my-3"/>
                <CardContent>
                    <FieldGroup>
                        <FieldGroup className="flex flex-row items-end gap-2">
                            <div
                                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border"
                                style={{ backgroundColor: `${selectedColor}1a` }}
                            >
                                <PreviewIcon
                                    className="h-10 w-10"
                                    style={{ color: selectedColor }}
                                />
                            </div>

                            <form.Field
                                name="name"
                                validators={{
                                    onBlur: zodFieldValidator(
                                        alertTypeSchema.shape.name
                                    ),
                                }}
                            >
                                {(field) => (
                                    <Field
                                        className="flex-1"
                                        data-invalid={!field.state.meta.isValid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Alert Type
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id={field.name}
                                                placeholder="e.g. Structure Fire"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.value)
                                                }
                                                disabled={isPending}
                                                aria-invalid={!field.state.meta.isValid}
                                            />
                                            <InputGroupAddon>
                                                <Siren className="h-4 w-4" />
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
                                name="emergency_category_id"
                                validators={{
                                    onBlur: zodFieldValidator(
                                        alertTypeSchema.shape.emergency_category_id
                                    ),
                                }}
                            >
                                {(field) => (
                                    <Field
                                        className="flex-1"
                                        data-invalid={!field.state.meta.isValid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Parent Category
                                        </FieldLabel>
                                        {categoriesLoading ? (
                                            <Skeleton className="h-9 w-full" />
                                        ) : (
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) =>
                                                    field.handleChange(val)
                                                }
                                                disabled={isPending}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectGroup>
                                                        {categories.map((cat) => (
                                                            <SelectItem
                                                                key={cat.id}
                                                                value={String(cat.id)}
                                                            >
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <FieldError
                                            errors={field.state.meta.errors.map(
                                                (message) => ({ message })
                                            )}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                        </FieldGroup>

                        <FieldGroup className="flex-row">
                            <form.Field name="description">
                                {(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Description
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id={field.name}
                                                placeholder="What kind of alerts belong to this category?"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.value)
                                                }
                                                disabled={isPending}
                                            />
                                        </InputGroup>
                                    </Field>
                                )}
                            </form.Field>

                            <Field>
                                <FieldLabel>Response Instructions</FieldLabel>
                                <div className="flex flex-col gap-2">
                                    {instructions.map((step, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <GripVertical className="p-0 shrink-0 text-muted-foreground/50" />
                                            <InputGroup className="flex-1">
                                                <InputGroupAddon>
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                                        {index + 1}
                                                    </span>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    placeholder={
                                                        index === 0
                                                            ? "e.g. Drop to the ground"
                                                            : index === 1
                                                                ? "e.g. Take cover under sturdy furniture"
                                                                : "Add the next step"
                                                    }
                                                    value={step}
                                                    onChange={(e) =>
                                                        updateInstruction(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={isPending}
                                                />
                                            </InputGroup>
                                            {index === 0 ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    aria-label="Add step"
                                                    onClick={addInstruction}
                                                    disabled={isPending}
                                                    className="shrink-0 text-muted-foreground hover:text-primary"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    aria-label="Remove step"
                                                    onClick={() =>
                                                        removeInstruction(index)
                                                    }
                                                    disabled={isPending}
                                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Field>
                        </FieldGroup>

                        <form.Field name="severity">
                            {(field) => (
                                <Field data-invalid={!field.state.meta.isValid}>
                                    <FieldLabel>Default Severity</FieldLabel>
                                    <RadioGroup
                                        value={field.state.value}
                                        onValueChange={(val) =>
                                            field.handleChange(val)
                                        }
                                        className="grid grid-cols-4 gap-2"
                                        disabled={isPending}
                                    >
                                        {[
                                            {
                                                value: "low",
                                                title: "Low",
                                                description: "Minimal impact",
                                            },
                                            {
                                                value: "medium",
                                                title: "Medium",
                                                description: "Moderate impact",
                                            },
                                            {
                                                value: "high",
                                                title: "High",
                                                description: "Serious impact",
                                            },
                                            {
                                                value: "critical",
                                                title: "Critical",
                                                description: "Immediate danger",
                                            },
                                        ].map((opt) => (
                                            <FieldLabel
                                                key={opt.value}
                                                htmlFor={`${opt.value}-severity`}
                                            >
                                                <Field
                                                    orientation="horizontal"
                                                    className="items-center justify-between rounded-md border p-3"
                                                >
                                                    <FieldContent>
                                                        <FieldTitle>{opt.title}</FieldTitle>
                                                        <FieldDescription>
                                                            {opt.description}
                                                        </FieldDescription>
                                                    </FieldContent>
                                                    <RadioGroupItem
                                                        value={opt.value}
                                                        id={`${opt.value}-severity`}
                                                    />
                                                </Field>
                                            </FieldLabel>
                                        ))}
                                    </RadioGroup>
                                    <FieldError
                                        errors={field.state.meta.errors.map(
                                            (message) => ({ message })
                                        )}
                                    />
                                </Field>
                            )}
                        </form.Field>

                        <Field>
                            <FieldLabel>Icon</FieldLabel>
                            <Card className="grid grid-cols-18 place-items-center gap-2 p-3 bg-muted/30">
                                {iconOptions.map((name) => {
                                    const Icon = iconMap[name];
                                    const isSelected = name === selectedIcon;
                                    return (
                                        <button
                                            key={name}
                                            type="button"
                                            aria-pressed={isSelected}
                                            aria-label={name}
                                            disabled={isPending}
                                            onClick={() => setSelectedIcon(name)}
                                            className={`flex aspect-square w-full items-center justify-center rounded-md border border-transparent transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${isSelected
                                                    ? "border-primary/30 bg-accent ring-2 ring-primary ring-offset-1"
                                                    : ""
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </button>
                                    );
                                })}
                            </Card>
                        </Field>

                        <Field>
                            <FieldLabel>Color</FieldLabel>
                            <Card className="grid grid-cols-12 place-items-center gap-2 p-3 bg-muted/30">
                                {colorMap.map((color) => {
                                    const isSelected = color === selectedColor;
                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            aria-pressed={isSelected}
                                            aria-label={`Select color ${color}`}
                                            disabled={isPending}
                                            onClick={() => setSelectedColor(color)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: isSelected
                                                    ? `0 0 0 2px white, 0 0 0 4px ${color}`
                                                    : undefined,
                                            }}
                                        >
                                            {isSelected && (
                                                <Check
                                                    className="h-4 w-4 text-white drop-shadow"
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </Card>
                        </Field>
                    </FieldGroup>
                </CardContent>

                <CardFooter className="mt-4">
                    <CardAction className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => navigate("/emergency")}
                        >
                            Cancel
                        </Button>
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
                                        !canSubmit || isSubmitting || isPending
                                    }
                                >
                                    {isSubmitting || isPending ? (
                                        <>
                                            <Spinner />
                                            Saving alert...
                                        </>
                                    ) : isEditing ? (
                                        "Save changes"
                                    ) : (
                                        "Save alert"
                                    )}
                                </Button>
                            )}
                        </form.Subscribe>
                    </CardAction>
                </CardFooter>
            </form>
        </Card>
    );
};

export default AlertForm;
