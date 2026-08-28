import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLegend
} from "@/components/ui/field";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty";
import {
    PlusCircle,
    Search,
    Ellipsis,
    SquarePen,
    ShieldMinus,
    ShieldCheck,
    Trash2,
    LayersPlus
} from "lucide-react";
import {
    getEmergencyCategories,
    toggleEmergencyCategoryStatus,
} from "@/services/EmergencyCategoryService";
import { normalizeList } from "@/lib/utils";
import EmergencyCategoryForm from "./emergency/EmergencyCategoryForm";
import EmergencyCategoryDeleteDialog from "./emergency/EmergencyCategoryDeleteDialog";

const showErrorToast = (err, fallback) =>
    toast.error(err.response?.data?.message || fallback);

const CategoryListSkeleton = () => (
    <>
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-2 p-4">
                <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        ))}
    </>
);

const EmergencyCategory = ({ selectedCategoryId, onSelectCategory }) => {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["emergency-categories"],
        queryFn: getEmergencyCategories,
        staleTime: 30_000,
    });
    const categories = normalizeList(data);
    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleMutation = useMutation({
        mutationFn: (id) => toggleEmergencyCategoryStatus(id),
        onSuccess: (_, id) => {
            const wasActive = categories.find((c) => c.id === id)?.is_active !== false;
            toast.success(wasActive ? "Category deactivated." : "Category activated.");
            queryClient.invalidateQueries({ queryKey: ["emergency-categories"] });
        },
        onError: (err) => showErrorToast(err, "Failed to update status."),
    });

    const isMutating = toggleMutation.isPending;

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleFormClose = (open) => {
        setIsFormOpen(open);
        if (!open) setEditingCategory(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="gap-0">
                    <CardTitle>Emergency Category</CardTitle>
                    <CardDescription>
                        {isLoading ? "\u00A0" : `${categories.length} total`}
                    </CardDescription>
                    <CardAction className="self-center">
                        <Button onClick={() => setIsFormOpen(true)}>
                            <PlusCircle />
                            New Type
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <InputGroup>
                        <InputGroupInput
                            id="search-category"
                            placeholder="Search Emergency Category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </CardContent>
                <Separator />
                <CardContent className="p-0 -my-(--card-spacing)">
                    {isLoading ? (
                        <CategoryListSkeleton />
                    ) : filtered.length === 0 ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon" className="h-10.5 w-10.5">
                                    <LayersPlus className="size-8" />
                                </EmptyMedia>
                                <EmptyTitle>No categories</EmptyTitle>
                                <EmptyDescription className="max-w-sm text-sm">
                                    Create a new emergency alert category to organize related alert types.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        filtered.map((category) => {
                            const isSelected = selectedCategoryId === category.id;
                            const isActive = category.is_active !== false;
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                        onSelectCategory?.(isSelected ? null : category.id)
                                    }
                                    className={`w-full text-left block transition-colors hover:bg-muted/50 ${isSelected ? "bg-muted" : ""
                                        }`}
                                >
                                    <FieldGroup className="flex flex-row items-center justify-between gap-2 p-4">
                                        <Field className="flex flex-col gap-0 flex-1 min-w-0">
                                            <FieldLegend
                                                className={
                                                    !isActive
                                                        ? "text-muted-foreground"
                                                        : undefined
                                                }
                                            >
                                                <span className={!isActive ? "line-through" : undefined}>
                                                    {category.name}
                                                </span>
                                                <Badge
                                                    variant={isActive ? "active" : "destructive"}
                                                    className="ml-2"
                                                >
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </FieldLegend>
                                            <FieldDescription>
                                                {category.alert_types_count ?? 0} alert type
                                                {category.alert_types_count !== 1 ? "s" : ""}
                                            </FieldDescription>
                                        </Field>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Ellipsis className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(category);
                                                    }}
                                                >
                                                    <SquarePen />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleMutation.mutate(category.id);
                                                    }}
                                                    disabled={isMutating}
                                                >
                                                    {isActive ? (
                                                        <>
                                                            <ShieldMinus />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck />
                                                            Activate
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <EmergencyCategoryDeleteDialog
                                                    category={category}
                                                    onSuccess={(id) => {
                                                        if (selectedCategoryId === id) onSelectCategory?.(null);
                                                    }}
                                                    trigger={
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            <Trash2 />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </FieldGroup>
                                </button>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            <EmergencyCategoryForm
                open={isFormOpen}
                onOpenChange={handleFormClose}
                category={editingCategory}
            />
        </>
    );
};

export default EmergencyCategory;