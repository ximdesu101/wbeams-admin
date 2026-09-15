"use client"

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
    Loader,
    Star,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/formatDate";
import { getFeedback } from "@/services/feedbackService";

const PAGE_SIZE = 10;

const typeLabel = (type) => {
    if (!type) return "—";
    return type.charAt(0).toUpperCase() + type.slice(1);
};

const subjectFor = (item) => {
    if (item.type === "alert") {
        return item.alert?.title || "Emergency Alert";
    }
    if (item.type === "operator") {
        return item.operator?.name
            ? `Operator: ${item.operator.name}`
            : "Operator Service";
    }
    return "System Experience";
};

const FeedbackTable = () => {
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["feedback-list", typeFilter, searchTerm],
        queryFn: () =>
            getFeedback({
                type: typeFilter === "all" ? "all" : typeFilter,
                search: searchTerm || undefined,
            }),
        placeholderData: (previous) => previous,
        staleTime: 15_000,
    });

    const items = data?.data ?? [];
    const total = data?.meta?.total ?? items.length;

    const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return items.slice(start, start + PAGE_SIZE);
    }, [items, currentPage]);

    useEffect(() => {
        if (currentPage > lastPage) {
            setCurrentPage(1);
        }
    }, [lastPage, currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(lastPage, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [currentPage, lastPage]);

    const renderRating = (item) => {
        if (item.type === "alert") {
            if (item.rating === "like") {
                return (
                    <div className="flex items-center gap-1 text-emerald-700">
                        <ThumbsUp className="size-4" />
                        <span>Helpful</span>
                    </div>
                );
            }
            if (item.rating === "dislike") {
                return (
                    <div className="flex items-center gap-1 text-rose-500">
                        <ThumbsDown className="size-4" />
                        <span>Not Helpful</span>
                    </div>
                );
            }
            return (
                <span className="text-muted-foreground">—</span>
            );
        }

        if (item.rating != null) {
            return (
                <div className="flex items-center gap-1">
                    <Star className="size-4 fill-current text-amber-500" />
                    <span>{item.rating}/5</span>
                </div>
            );
        }

        return <span className="text-muted-foreground">—</span>;
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                                            <Loader className="size-5 animate-spin" />
                                            <p>Loading feedback...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                                            <CircleSlash />
                                            <p>Failed to load feedback</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : pageItems.length > 0 ? (
                                pageItems.map((feedback) => (
                                    <TableRow key={`${feedback.type}-${feedback.id}`}>
                                        <TableCell className="font-medium">
                                            {typeLabel(feedback.type)}
                                        </TableCell>
                                        <TableCell>
                                            {feedback.recipient?.name || "—"}
                                        </TableCell>
                                        <TableCell>
                                            {subjectFor(feedback)}
                                        </TableCell>
                                        <TableCell>
                                            {renderRating(feedback)}
                                        </TableCell>
                                        <TableCell className="max-w-[280px] truncate">
                                            {feedback.comment || "—"}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(feedback.submittedAt)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
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
                            {total === 0
                                ? "No results"
                                : `Page ${currentPage} of ${lastPage} · ${total} total`}
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

                                    {pageNumbers.map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={currentPage === page}
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

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
        </div>
    );
}

export default FeedbackTable;