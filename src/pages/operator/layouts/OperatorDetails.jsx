import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { getOperator } from "@/services/operatorService";
import OperatorActivityMatrix from "./details/DetailsDaily";
import DetailsChart from "./details/DetailsChart";
import DetailsAction from "./details/DetailsAction";

export default function OperatorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: operator,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["operator", id],
        queryFn: async () => {
            const res = await getOperator(id);
            return res.data;
        },
    });

    const notFound = isError && error?.response?.status === 404;

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-64" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <p className="text-muted-foreground mt-4">Operator not found.</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <p className="text-muted-foreground mt-4">Failed to load operator details.</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                        <AvatarImage
                            src={operator.avatar ?? ""}
                            alt={operator.full_name}
                        />
                        <AvatarFallback className="text-base font-semibold">
                            {operator.first_name?.[0]}
                            {operator.last_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            {operator.last_name}, {operator.first_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {operator.operator_id}
                        </p>
                    </div>
                </div>
                <Badge
                    className={`capitalize px-3 py-1 text-sm ${operator.status === "active"
                        ? "bg-green-100 text-green-600"
                        : operator.status === "inactive"
                            ? "bg-yellow-100 text-yellow-600"
                            : operator.status === "expired"
                                ? "bg-red-100 text-red-600"
                                : operator.status === "deactivated"
                                    ? "bg-slate-100 text-slate-700"
                                    : "bg-yellow-500 hover:bg-yellow-600 text-black"
                        }`}
                >
                    {operator.status_label}
                </Badge>
            </CardHeader>
            <Separator />
            <CardContent className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="col-span-2">
                        <OperatorActivityMatrix operatorId={operator.operator_id} />
                    </div>
                    <DetailsAction operator={operator} />
                </div>
                <DetailsChart operatorId={operator.operator_id} />
            </CardContent>
        </Card>
    );
}