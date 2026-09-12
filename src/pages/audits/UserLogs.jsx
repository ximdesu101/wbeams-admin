import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import {
    Field,
    FieldGroup
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon
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
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Search,
    Loader,
    CircleSlash,
} from "lucide-react";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { getUserLogs } from "@/services/userLogService";

const ACTIVITIES = [
    { value: "all", label: "All Activities" },
    { value: "Logged in", label: "Logged in" },
    { value: "Logged out", label: "Logged out" },
    { value: "Sent an emergency alert", label: "Sent an emergency alert" },
    { value: "Resolved a reported incident", label: "Resolved a reported incident" },
    { value: "Rejected a reported incident", label: "Rejected a reported incident" },
    { value: "Sent a report", label: "Sent a report" },
    { value: "Acknowledged an alert", label: "Acknowledged an alert" },
];

const ROLES = [
    { value: "all", label: "All Roles" },
    { value: "operator", label: "Operator" },
    { value: "recipient", label: "Recipient" },
];

/**
 * Convert an ISO timestamp to a human-readable relative label.
 */
function relativeTime(isoString) {
    if (!isoString) return "—";

    const now = new Date();
    const then = new Date(isoString);
    const diffSec = Math.floor((now - then) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? "min" : "mins"} ago`;
    if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? "hour" : "hours"} ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay} days ago`;

    return then.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const UserLogs = () => {
    useDocumentTitle("NwSSU Alerts | User Logs");

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activityFilter, setActivityFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["user-logs", currentPage, searchTerm, activityFilter, roleFilter],
        queryFn: () => getUserLogs(currentPage, searchTerm, activityFilter, roleFilter),
        placeholderData: (prev) => prev,
        staleTime: 15_000,
    });

    const logs = data?.data ?? [];
    const meta = data?.meta ?? {};
    const lastPage = meta.last_page ?? 1;

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    const handleActivityChange = (value) => {
        setActivityFilter(value);
        setCurrentPage(1);
    };

    const handleRoleChange = (value) => {
        setRoleFilter(value);
        setCurrentPage(1);
    };

    const getEmptyMessage = () => {
        const hasSearch = searchTerm.trim().length > 0;
        const hasActivity = activityFilter !== "all";
        const hasRole = roleFilter !== "all";

        if (hasSearch) return `No record matching "${searchTerm}"`;
        if (hasActivity || hasRole) return "No log entries match the selected filters";
        return "No activity logs found";
    };

    return (
        <div className="grid gap-2">
            <FieldGroup className="flex flex-row items-center justify-between">
                <Field className="w-80">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            placeholder="Search logs..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <InputGroupAddon><Search /></InputGroupAddon>
                    </InputGroup>
                </Field>

                <div className="flex gap-2">
                    <Select value={roleFilter} onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Filter Role" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                {ROLES.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={activityFilter} onValueChange={handleActivityChange}>
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Filter Activity" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                {ACTIVITIES.map((a) => (
                                    <SelectItem key={a.value} value={a.value}>
                                        {a.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </FieldGroup>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader className="animate-spin" />
                                        <p>Loading activity logs...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <CircleSlash />
                                        <p>Failed to load activity logs.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.id}</TableCell>
                                    <TableCell>{log.name}</TableCell>
                                    <TableCell>{log.email}</TableCell>
                                    <TableCell>{log.contact}</TableCell>
                                    <TableCell>{log.role}</TableCell>
                                    <TableCell>{log.activity}</TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
                                        {relativeTime(log.time)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>
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

                <div className="flex items-center justify-end px-2 py-2">
                    <div className="text-muted-foreground flex-1 text-sm">
                        Page {currentPage} of {lastPage}
                    </div>
                    <div>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                {[...Array(lastPage)].map((_, i) => {
                                    const page = i + 1;
                                    if (
                                        page === 1 ||
                                        page === lastPage ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page)}
                                                    isActive={currentPage === page}
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
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className={currentPage === lastPage || lastPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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

export default UserLogs;
