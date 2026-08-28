import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLegend,
} from "@/components/ui/field";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
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
    PlusCircle,
    Search,
    Edit,
    Trash2,
    ShieldMinus,
    ShieldCheck,
    LayersPlus,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAlertTypes,
    toggleAlertTypeStatus,
} from "@/services/alertTypeService";
import {
    getEmergencyCategory,
    getEmergencyCategories,
} from "@/services/EmergencyCategoryService";
import AlertDelete from "./alert/AlertDelete";
import { normalizeList } from "@/lib/utils";

const iconMap = {
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
};

const AlertTypeListSkeleton = () => (
    <>
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-2 p-4">
                <div className="flex items-center gap-2 flex-1">
                    <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-1 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                </div>
                <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        ))}
    </>
);

const AlertType = ({ selectedCategoryId }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ── Fetch all categories, just to know whether any exist ────────────────
    const { data: allCategoriesData, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["emergency-categories"],
        queryFn: getEmergencyCategories,
        staleTime: 30_000,
    });
    const hasCategories = normalizeList(allCategoriesData).length > 0;

    // ── Fetch selected category's details (name/description for the header) ─
    const { data: categoryData } = useQuery({
        queryKey: ["emergency-category", selectedCategoryId],
        queryFn: () => getEmergencyCategory(selectedCategoryId),
        enabled: !!selectedCategoryId,
        staleTime: 30_000,
    });

    // ── Fetch alert types (filtered by category when one is selected) ───────
    // Use same queryKey as CardMetrics when no category selected → share cache
    const alertTypesQueryKey = selectedCategoryId
        ? ["alert-types", selectedCategoryId]
        : ["alert-types"];

    const { data, isLoading: isAlertTypesLoading } = useQuery({
        queryKey: alertTypesQueryKey,
        queryFn: () => getAlertTypes(selectedCategoryId),
        staleTime: 30_000,
    });
    const alertTypes = normalizeList(data);
    const filtered = alertTypes.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const isLoading = isCategoriesLoading || isAlertTypesLoading;

    // ── Toggle status ─────────────────────────────────────────────────────────
    const toggleMutation = useMutation({
        mutationFn: (id) => toggleAlertTypeStatus(id),
        onSuccess: (_, id) => {
            const wasActive = alertTypes.find((t) => t.id === id)?.is_active !== false;
            toast.success(wasActive ? "Alert type deactivated." : "Alert type activated.");
            queryClient.invalidateQueries({ queryKey: ["alert-types"] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update status.");
        },
    });

    const getSeverityBadgeStyles = (severity) => {
        const severityMap = {
            low: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
            medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
            high: 'bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200',
            critical: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
        };
        return severityMap[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200';
    };

    const cardDescription = !hasCategories
        ? "No categories available. Please create a category first."
        : categoryData
            ? categoryData.description || `Alert types for ${categoryData.name}`
            : "All alert types across all categories";

    return (
        <>
            <Card>
                <CardHeader className="gap-0">
                    <CardTitle>{categoryData?.name || "Alert Types"}</CardTitle>
                    <CardDescription>{cardDescription}</CardDescription>
                    <CardAction className="self-center">
                        <Button
                            onClick={() =>
                                navigate("/emergency/new-alert", {
                                    state: { categoryId: selectedCategoryId ?? null },
                                })
                            }
                            disabled={!hasCategories}
                            title={!hasCategories ? "Please create a category first" : ""}
                        >
                            <PlusCircle />
                            New Alert Type
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex justify-between">
                    <InputGroup>
                        <InputGroupInput
                            id="search-alert"
                            placeholder="Search Alert Type . . ."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            disabled={!hasCategories}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </CardContent>
                <Separator />
                <CardContent className="p-0 -my-(--card-spacing)">
                    {isLoading ? (
                        <AlertTypeListSkeleton />
                    ) : !hasCategories ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon" className="h-10.5 w-10.5">
                                    <LayersPlus className="size-8" />
                                </EmptyMedia>
                                <EmptyTitle>No categories available</EmptyTitle>
                                <EmptyDescription className="max-w-sm text-sm">
                                    Please create an emergency category first before adding alert types.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : filtered.length === 0 ? (
                        alertTypes.length === 0 ? (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon" className="h-10.5 w-10.5">
                                        <LayersPlus className="size-8" />
                                    </EmptyMedia>
                                    <EmptyTitle>No alert types yet</EmptyTitle>
                                    <EmptyDescription className="max-w-sm text-sm">
                                        Create the first alert type for {categoryData?.name || "this category"}.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <Empty className="py-12">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Search className="size-6" />
                                    </EmptyMedia>
                                    <EmptyTitle>No results found</EmptyTitle>
                                    <EmptyDescription className="max-w-sm text-sm">
                                        No alert types match "<strong>{search}</strong>".
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )
                    ) : (
                        filtered.map((type) => {
                            const Icon = iconMap[type.icon] ?? Siren;
                            const isActive = type.is_active !== false;
                            const iconColor = type.color ?? "#64748b";

                            return (
                                <FieldGroup
                                    key={type.id}
                                    className="flex flex-row items-center justify-between gap-2 p-4 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border"
                                            style={{ backgroundColor: `${iconColor}1a` }}
                                        >
                                            <Icon className="h-6 w-6" style={{ color: iconColor }} />
                                        </div>
                                        <Field className="flex flex-col gap-0 min-w-0">
                                            <FieldLegend
                                                className={
                                                    !isActive
                                                        ? "text-muted-foreground"
                                                        : undefined
                                                }
                                            >
                                                <span className={!isActive ? "line-through" : undefined}>
                                                    {type.name}
                                                </span>
                                                {type.severity && (
                                                    <Badge
                                                        className={`ml-2 ${getSeverityBadgeStyles(type.severity)}`}
                                                    >
                                                        {type.severity.charAt(0).toUpperCase() + type.severity.slice(1)}
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant={isActive ? "active" : "destructive"}
                                                    className="ml-2"
                                                >
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </FieldLegend>
                                            <FieldDescription className="truncate">
                                                {type.description ?? "No description provided."}
                                            </FieldDescription>
                                        </Field>
                                    </div>
                                    <CardAction className="shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={isActive ? "Deactivate" : "Activate"}
                                            disabled={toggleMutation.isPending}
                                            onClick={() => toggleMutation.mutate(type.id)}
                                        >
                                            {isActive ? (
                                                <ShieldMinus className="h-4 w-4" />
                                            ) : (
                                                <ShieldCheck className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="safe"
                                            size="icon"
                                            aria-label="Edit"
                                            onClick={() =>
                                                navigate("/emergency/new-alert", {
                                                    state: { alertType: type },
                                                })
                                            }
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            aria-label="Delete"
                                            onClick={() => setDeleteTarget(type)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardAction>
                                </FieldGroup>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            <AlertDelete
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                deleteTarget={deleteTarget}
                onSuccess={() => setDeleteTarget(null)}
            />
        </>
    );
};

export default AlertType;