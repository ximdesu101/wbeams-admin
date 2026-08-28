import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {
    Search,
    CircleSlash,
    View,
    Trash2,
    Loader
} from "lucide-react";
import DeleteAlertDialog from "./DeleteAlertDialog";
import {
    getAlerts,
    deleteAlert
} from "@/services/alertService";

const SentAlertTable = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [severityFilter, setSeverityFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const queryClient = useQueryClient();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["alerts", currentPage, searchTerm],
        queryFn: () => getAlerts(currentPage, searchTerm),
        placeholderData: (previousData) => previousData,
    });

    const alerts = data?.data ?? data ?? [];
    const meta = data?.meta ?? {};
    const lastPage = meta.last_page ?? 1;

    const filteredAlerts = alerts.filter((alert) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        const matchesSearch =
            normalizedSearch.length === 0 ||
            Object.values(alert).some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(normalizedSearch)
            );

        const matchesSeverity =
            severityFilter === "all" ||
            alert.severity?.toLowerCase() === severityFilter;

        return matchesSearch && matchesSeverity;
    });

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;

        setCurrentPage(page);
    };

    const handleSeverityChange = (severity) => {
        setSeverityFilter(severity);
        setCurrentPage(1);
    };

    const getEmptyMessage = () => {
        const hasSearch = searchTerm.trim().length > 0;
        const hasSeverity = severityFilter !== "all";

        if (hasSearch && hasSeverity) {
            return `No "${searchTerm}" record with ${severityFilter} severity`;
        }

        if (hasSearch) {
            return `No record matching "${searchTerm}"`;
        }

        if (hasSeverity) {
            return `No record with ${severityFilter} severity`;
        }

        return "No sent alert record found";
    };

    return (
        <div className="grid gap-2">
            <FieldGroup className="flex flex-row items-center justify-between">
                <Field className="w-80">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            placeholder="Search sent alerts..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
                <Select
                    value={severityFilter}
                    onValueChange={handleSeverityChange}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter Severity" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectGroup>
                            <SelectItem value="all">
                                All Severity
                            </SelectItem>
                            <SelectItem value="low">
                                Low
                            </SelectItem>
                            <SelectItem value="medium">
                                Medium
                            </SelectItem>
                            <SelectItem value="high">
                                High
                            </SelectItem>
                            <SelectItem value="critical">
                                Critical
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </FieldGroup>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Emergency Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Sent By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader className="animate-spin" />
                                        <p>Loading sent alerts...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <CircleSlash />
                                        <p>Failed to load alerts.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredAlerts.length > 0 ? (
                            filteredAlerts.map((alert) => (
                                <TableRow key={alert.id}>
                                    <TableCell>
                                        {alert.id}
                                    </TableCell>

                                    <TableCell>
                                        {alert.EmergencyType}
                                    </TableCell>

                                    <TableCell>
                                        <div className="max-w-[280px] truncate">
                                            {alert.Description}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {alert.location}
                                    </TableCell>

                                    <TableCell>
                                        {alert.severity}
                                    </TableCell>

                                    <TableCell>
                                        {alert.status}
                                    </TableCell>

                                    <TableCell>
                                        {alert.reportedBy}
                                    </TableCell>

                                    <TableCell>
                                        {alert.date}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DeleteAlertDialog alert={alert}/>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <CircleSlash />
                                        <p>{getEmptyMessage()}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Separator />

                {/* Pagination */}
                <div className="flex items-center justify-end px-2 py-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Page {currentPage} of {lastPage}
                    </div>
                    <div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        className={
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                                {[...Array(lastPage)].map((_, index) => {
                                    const page = index + 1;
                                    if (
                                        page === 1 ||
                                        page === lastPage ||
                                        (page >= currentPage - 1 &&
                                            page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    isActive={
                                                        currentPage === page
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        className={
                                            currentPage === lastPage
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentAlertTable;
