import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Field,
    FieldGroup
} from "@/components/ui/field";
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
    Loader
} from "lucide-react";
import { getReports } from "@/services/reportService";

const ReportTable = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

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
        queryKey: ["reports", currentPage, searchTerm],
        queryFn: () => getReports(currentPage, searchTerm),
        placeholderData: (previousData) => previousData,
    });

    const reports = data?.data ?? [];
    const meta = data?.meta ?? {};

    const lastPage = meta.last_page ?? 1;

    const filteredReports = reports.filter((report) => {
        if (statusFilter === "all") {
            return true;
        }

        return report.status?.toLowerCase() === statusFilter;
    });

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) {
            return;
        }

        setCurrentPage(page);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const getEmptyMessage = () => {
        const hasSearch = searchTerm.trim().length > 0;
        const hasStatus = statusFilter !== "all";

        if (hasSearch && hasStatus) {
            return `No "${searchTerm}" record with ${statusFilter} status`;
        }

        if (hasSearch) {
            return `No record matching "${searchTerm}"`;
        }

        if (hasStatus) {
            return `No record with ${statusFilter} status`;
        }

        return "No incident report found";
    };

    return (
        <div className="grid gap-2">
            <FieldGroup className="flex flex-row items-center justify-between">
                <Field className="w-80">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            placeholder="Search incident reports..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
                <Select
                    value={statusFilter}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectGroup>
                            <SelectItem value="all">
                                All Status
                            </SelectItem>
                            <SelectItem value="pending">
                                Pending
                            </SelectItem>
                            <SelectItem value="acknowledged">
                                Acknowledged
                            </SelectItem>
                            <SelectItem value="resolved">
                                Resolved
                            </SelectItem>
                            <SelectItem value="rejected">
                                Rejected
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
                            <TableHead>Reported By</TableHead>
                            <TableHead>Date Reported</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned Operator</TableHead>
                            <TableHead className="text-right">
                                Review At
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={10}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader className="animate-spin" />
                                        <p>Loading reported incidents . . .</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={10}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <CircleSlash />
                                        <p>Failed to load reports.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        {report.id}
                                    </TableCell>
                                    <TableCell>
                                        {report.EmergencyType}
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[120px] truncate">
                                            {report.Description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-[100px] truncate">
                                            {report.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {report.ReportedBy}
                                    </TableCell>
                                    <TableCell>
                                        {report.DateReported}
                                    </TableCell>
                                    <TableCell>
                                        {report.status}
                                    </TableCell>
                                    <TableCell>
                                        {report.AssignedOperator}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {report.ReviewAt}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10}>
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
                                {Array.from(
                                    { length: lastPage },
                                    (_, index) => index + 1
                                ).map((page) => {
                                    const shouldShow =
                                        page === 1 ||
                                        page === lastPage ||
                                        (page >= currentPage - 1 &&
                                            page <= currentPage + 1);
                                    if (!shouldShow) {
                                        return null;
                                    }
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
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            handlePageChange(
                                                currentPage + 1
                                            )
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

export default ReportTable;