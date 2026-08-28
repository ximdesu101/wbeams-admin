import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
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
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Search,
    Loader,
    CircleSlash,
} from "lucide-react";
import useDocumentTitle from "@/hooks/useDocumentTitle"
import { formatDate } from "@/lib/formatDate";
import { getOperators } from "@/services/operatorService";
import { getRecipients } from "@/services/recipientService";

const UserLogs = () => {
    useDocumentTitle("NwSSU Alertss | Audits")
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("Operators");
    const [currentPage, setCurrentPage] = useState(1);

    const isOperatorTab = selectedTab === "Operators";
    const columnCount = isOperatorTab ? 9 : 8;

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
    } = useQuery({
        queryKey: isOperatorTab
            ? ["operators", currentPage, searchTerm]
            : ["recipients", currentPage, searchTerm, ""],
        queryFn: () =>
            isOperatorTab
                ? getOperators(currentPage, searchTerm)
                : getRecipients(currentPage, searchTerm, ""),
        placeholderData: (previousData) => previousData,
        staleTime: 15_000,
    });

    const rows = useMemo(() => {
        const list = data?.data ?? [];
        if (isOperatorTab) {
            return list.map((op) => ({
                id: op.operator_id,
                first_name: op.first_name,
                last_name: op.last_name,
                email: op.email,
                contact: op.contact_number,
                role: "Operator",
                status: op.status_label || op.status,
                registered_at: op.created_at,
                activated_at: op.activated_at,
            }));
        }
        return list.map((r) => ({
            id: r.id_number || String(r.id),
            first_name: r.first_name,
            last_name: r.last_name,
            email: r.email,
            contact: r.contact_number,
            role: r.role
                ? r.role.charAt(0).toUpperCase() + r.role.slice(1)
                : "Recipient",
            status: r.status
                ? r.status.charAt(0).toUpperCase() + r.status.slice(1)
                : "Registered",
            registered_at: r.created_at,
            activated_at: null,
        }));
    }, [data, isOperatorTab]);

    const meta = data?.meta ?? {};
    const lastPage = meta.last_page ?? 1;

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    const getEmptyMessage = () => {
        if (searchTerm.trim()) {
            return `No ${selectedTab.toLowerCase()} matching "${searchTerm}"`;
        }
        return `No ${selectedTab.toLowerCase()} found`;
    };

    const getStatusClass = (status) => {
        const s = String(status ?? "").toLowerCase();
        if (s.includes("active") || s === "registered") return "bg-green-100 text-green-700";
        if (s.includes("pending") || s === "inactive") return "bg-yellow-100 text-yellow-700";
        if (s === "expired") return "bg-red-100 text-red-700";
        if (s === "deactivated") return "bg-slate-100 text-slate-700";
        return "bg-muted text-muted-foreground";
    };

    return (
        <div className="grid gap-2">
            <Tabs value={selectedTab} onValueChange={handleTabChange}>
                <FieldGroup className="flex flex-row items-center justify-between">
                    <TabsList className="w-80">
                        <TabsTrigger value="Operators">Operators</TabsTrigger>
                        <TabsTrigger value="Recipients">Recipients</TabsTrigger>
                    </TabsList>
                    <Field className="w-80">
                        <InputGroup>
                            <InputGroupInput
                                id="search"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                            />
                            <InputGroupAddon><Search/></InputGroupAddon>
                        </InputGroup>
                    </Field>
                </FieldGroup>
                <div className="overflow-hidden rounded-md border">
                    <Table className="p-0">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email Address</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registered At</TableHead>
                                {isOperatorTab && (
                                    <TableHead className="text-right">
                                        Activated At
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columnCount}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader className="animate-spin" />
                                            <p>Loading user logs . . .</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : rows.length > 0 ? (
                                rows.map((row, index) => (
                                    <TableRow key={`${row.id}-${index}`}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.first_name}</TableCell>
                                        <TableCell>{row.last_name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.contact}</TableCell>
                                        <TableCell>{row.role}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusClass(row.status)} variant="secondary">
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(row.registered_at)}</TableCell>
                                        {isOperatorTab && (
                                            <TableCell className="text-right">
                                                {row.activated_at ? formatDate(row.activated_at) : "—"}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columnCount}>
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
                                    {[...Array(lastPage)].map((_, index) => {
                                        const page = index + 1;
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
            </Tabs>
        </div>
    );
};

export default UserLogs;