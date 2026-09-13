"use client"

import { useState } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    Loader,
    Star,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const feedbackData = [
    {
        id: "FDB-001",
        type: "Operator",
        submittedBy: "Juan Dela Cruz",
        subject: "Operator Service",
        rating: 5,
        comment: "The operator responded quickly and was very helpful.",
        submittedAt: "Sept. 12, 2026",
        status: "Published",
    },
    {
        id: "FDB-002",
        type: "System",
        submittedBy: "Maria Santos",
        subject: "System Experience",
        rating: 4,
        comment: "The system is easy to use, but some pages load slowly.",
        submittedAt: "Sept. 11, 2026",
        status: "Published",
    },
    {
        id: "FDB-003",
        type: "Alert",
        submittedBy: "Pedro Reyes",
        subject: "Emergency Alert",
        rating: null,
        comment: "The alert provided useful information during the incident.",
        submittedAt: "Sept. 10, 2026",
        status: "Published",
    },
    {
        id: "FDB-004",
        type: "Operator",
        submittedBy: "Ana Garcia",
        subject: "Operator Service",
        rating: 3,
        comment: "The response was okay but could have been faster.",
        submittedAt: "Sept. 9, 2026",
        status: "Pending",
    },
    {
        id: "FDB-005",
        type: "System",
        submittedBy: "Carlos Mendoza",
        subject: "System Experience",
        rating: 5,
        comment: "Very convenient and easy to navigate.",
        submittedAt: "Sept. 8, 2026",
        status: "Published",
    },
    {
        id: "FDB-006",
        type: "Alert",
        submittedBy: "Elena Cruz",
        subject: "Emergency Alert",
        rating: null,
        comment: "The alert was clear and reached me immediately.",
        submittedAt: "Sept. 7, 2026",
        status: "Published",
    },
]

const FeedbackTable = () => {
    const [searchInput, setSearchInput] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredFeedback = feedbackData.filter((feedback) => {
        const search = searchInput.toLowerCase();

        const matchesSearch =
            feedback.id.toLowerCase().includes(search) ||
            feedback.submittedBy.toLowerCase().includes(search) ||
            feedback.subject.toLowerCase().includes(search) ||
            feedback.comment.toLowerCase().includes(search);

        const matchesType =
            typeFilter === "all" || feedback.type.toLowerCase() === typeFilter.toLowerCase();

        const matchesStatus =
            statusFilter === "all" || feedback.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesType && matchesStatus;
    });

    const handlePageChange = (page) => {
        if (page < 1) return;
        setCurrentPage(page);
    };

    return (
        <div className="grid gap-4">
            <Separator />

            <div className="grid gap-2">
                {/* Search and Filter Section */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <InputGroup className="w-80">
                            <InputGroupInput
                                id="search"
                                placeholder="Search feedback..."
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>

                        <Select
                            value={typeFilter}
                            onValueChange={(value) => {
                                setTypeFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Feedback Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="alert">Alert</SelectItem>
                                <SelectItem value="operator">Operator</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-md border">
                    <Table className="p-0">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Submitted By</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {false ? (
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader className="animate-spin" />
                                            <p>Loading feedback . . .</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredFeedback.length > 0 ? (
                                filteredFeedback.map((feedback) => (
                                    <TableRow key={feedback.id}>

                                        <TableCell>
                                            {feedback.type}
                                        </TableCell>

                                        <TableCell>
                                            {feedback.submittedBy}
                                        </TableCell>

                                        <TableCell>
                                            {feedback.subject}
                                        </TableCell>

                                        <TableCell>
                                            {feedback.rating ? (
                                                <div className="flex items-center gap-1">
                                                    <Star className="size-4 fill-current" />
                                                    <span>
                                                        {feedback.rating}.0
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Helpful / Not Helpful
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="max-w-[280px] truncate">
                                            {feedback.comment}
                                        </TableCell>

                                        <TableCell>
                                            {feedback.submittedAt}
                                        </TableCell>

                                        <TableCell>
                                            {feedback.status}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <View className="ml-auto size-4 cursor-pointer" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <CircleSlash />
                                            <p>No feedback found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Separator />

                    {/* Pagination */}
                    <div className="flex items-center justify-end px-2 py-2">
                        <div className="text-muted-foreground flex-1 text-sm">
                            Page {currentPage} of 1
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

                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={currentPage === 1}
                                            onClick={() =>
                                                handlePageChange(1)
                                            }
                                            className="cursor-pointer"
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                handlePageChange(currentPage + 1)
                                            }
                                            className={
                                                currentPage === 1
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
        </div>
    );
}

export default FeedbackTable;