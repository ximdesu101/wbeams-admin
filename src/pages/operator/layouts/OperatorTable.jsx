import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
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
    PlusCircle,
    Loader
} from "lucide-react";
import OperatorCard from "./OperatorCard";
import OperatorForm from "./OperatorForm";
import { formatDate } from "@/lib/formatDate";
import { getOperators } from "@/services/operatorService";

const OperatorTable = () => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");  
    const [searchTerm, setSearchTerm] = useState("");   
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
        queryKey: ["operators", currentPage, searchTerm],
        queryFn: () => getOperators(currentPage, searchTerm),
        onError: () => {
            toast.error("Failed to load operators.");
        },
        placeholderData: (previousData) => previousData,
        staleTime: 15_000,
    });

    const operators = data?.data ?? [];
    const meta = data?.meta ?? {};
    const lastPage = meta.last_page ?? 1;
    const statusCounts = meta.status_counts ?? {};
    const total = meta.total ?? 0;

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    const getEmptyMessage = () => {
        const hasSearch = searchTerm.trim().length > 0;

        if (hasSearch) {
            return `No operator information matching "${searchTerm}"`;
        }

        return "No operators found";
    };

    return (
        <div className="grid gap-4">
            <OperatorCard statusCounts={statusCounts} total={total} />
            <Separator />
            <div className="grid gap-2">
                {/*Search Section*/}
                <div className="flex items-center justify-between">
                    <InputGroup className="w-80">
                        <InputGroupInput
                            id="search"
                            placeholder="Search operators..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <InputGroupAddon><Search /></InputGroupAddon>
                    </InputGroup>
                    <Button variant="default" onClick={() => setIsFormOpen(true)}>
                        <PlusCircle className="w-4 h-4" />
                        Add Operator
                    </Button>
                    <OperatorForm
                        open={isFormOpen}
                        onOpenChange={setIsFormOpen}
                    />
                </div>

                {/*Table Section*/}
                <div className="overflow-hidden rounded-md border">
                    <Table className="p-0">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Operator ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Contact Number</TableHead>
                                <TableHead>Email Address</TableHead>
                                <TableHead>Create At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Activated At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader className="animate-spin" />
                                            <p>Loading operators . . .</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <CircleSlash />
                                            <p>Failed to load operators.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : operators.length > 0 ? (
                                operators.map((operator) => (
                                    <TableRow key={operator.operator_id}>
                                        <TableCell>{operator.operator_id}</TableCell>
                                        <TableCell>{operator.first_name}</TableCell>
                                        <TableCell>{operator.last_name}</TableCell>
                                        <TableCell>{operator.contact_number}</TableCell>
                                        <TableCell>{operator.email}</TableCell>
                                        <TableCell>{formatDate(operator.created_at)}</TableCell>
                                        <TableCell>{operator.status}</TableCell>
                                        <TableCell>{formatDate(operator.activated_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate(`/operator/${operator.operator_id}`)}
                                            >
                                                <View />
                                            </Button>
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
            </div>
        </div>
    );
}

export default OperatorTable;