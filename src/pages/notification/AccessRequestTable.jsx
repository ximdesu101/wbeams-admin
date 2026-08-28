import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/ui/field";
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
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Search,
    CircleSlash,
    Loader,
    Check,
    X,
} from "lucide-react";
import ApproveAccessRequestDialog from "./ApproveAccessRequest";
import { formatDate } from "@/lib/formatDate";
import {
    getAccessRequests,
    rejectAccessRequest,
} from "@/services/accessRequest";

const AccessRequestTable = () => {
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("pending");
    const [currentPage, setCurrentPage] = useState(1);
    const [actioningId, setActioningId] = useState(null);
    const [approveTarget, setApproveTarget] = useState(null);

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
        queryKey: ["access-requests", currentPage, searchTerm, selectedTab],
        queryFn: () => getAccessRequests(currentPage, searchTerm, selectedTab),
        placeholderData: (previousData) => previousData,
        staleTime: 15_000,
    });

    const requests = data?.data ?? [];
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

    const invalidateAccessRequests = () => {
        queryClient.invalidateQueries({ queryKey: ["access-requests"] });
        queryClient.invalidateQueries({ queryKey: ["access-requests-pending-count"] });
    };

    const handleReject = async (id) => {
        setActioningId(id);
        try {
            await rejectAccessRequest(id);
            toast.success("Access request rejected.");
            invalidateAccessRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject request.");
        } finally {
            setActioningId(null);
        }
    };

    const getEmptyMessage = () => {
        const hasSearch = searchTerm.trim().length > 0;
        if (hasSearch) return `No ${selectedTab} requests matching "${searchTerm}"`;
        return `No ${selectedTab} requests found`;
    };

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Tabs value={selectedTab} onValueChange={handleTabChange}>
                    <TabsList className="w-80">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Field className="w-80">
                    <InputGroup>
                        <InputGroupInput
                            id="search"
                            placeholder="Search..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <InputGroupAddon><Search/></InputGroupAddon>
                    </InputGroup>
                </Field>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table className="p-0">
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>ID Number</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Requested At</TableHead>
                            {selectedTab === "pending" && (
                                <TableHead className="text-right">Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={selectedTab === "pending" ? 6 : 5}>
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <p>Loading access requests . . .</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : requests.length > 0 ? (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.id_number}</TableCell>
                                    <TableCell>{request.first_name}</TableCell>
                                    <TableCell>{request.last_name}</TableCell>
                                    <TableCell>{request.email}</TableCell>
                                    <TableCell>{formatDate(request.created_at)}</TableCell>
                                    {selectedTab === "pending" && (
                                        <TableCell className="text-right">
                                            <Button
                                                variant="safe"
                                                size="icon"
                                                onClick={() => setApproveTarget(request)}
                                            >
                                                <Check />
                                            </Button>
                                            <ApproveAccessRequestDialog
                                                open={!!approveTarget}
                                                onOpenChange={(open) => !open && setApproveTarget(null)}
                                                accessRequest={approveTarget}
                                                onSuccess={invalidateAccessRequests}
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleReject(request.id)}
                                                disabled={actioningId === request.id}
                                            >
                                                {actioningId === request.id ? <Spinner /> : <X />}
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={selectedTab === "pending" ? 6 : 5}>
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
    );
};

export default AccessRequestTable;