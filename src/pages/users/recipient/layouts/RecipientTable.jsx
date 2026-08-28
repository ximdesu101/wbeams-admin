import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    View,
    Loader,
    CircleSlash,
    Trash2,
    Ban,
    CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { getRecipients } from "@/services/recipientService";
import CardMetrics from "./CardMetrics";
import RecipientDeleteDialog from "./RecipientDeleteDialog";
import RecipientStatusDialog from "./RecipientStatusDialog";

const tabToRole = {
    Student: "student",
    Faculty: "faculty",
    Staff: "staff",
}

const RecipientTable = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [searchInput, setSearchInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTab, setSelectedTab] = useState("Student")
    const [currentPage, setCurrentPage] = useState(1)
    const [statusTarget, setStatusTarget] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)

    const role = tabToRole[selectedTab]
    const isStudentTab = selectedTab === "Student"
    const columnCount = isStudentTab ? 10 : 8

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput)
            setCurrentPage(1)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchInput])

    const {
        data,
        isLoading,
    } = useQuery({
        queryKey: ["recipients", currentPage, searchTerm, role],
        queryFn: () => getRecipients(currentPage, searchTerm, role),
        placeholderData: (previousData) => previousData,
        staleTime: 15_000,
    })

    const recipients = data?.data ?? []
    const meta = data?.meta ?? {}
    const lastPage = meta.last_page ?? 1
    const statusCounts = meta.status_counts ?? { active: 0, deactivated: 0 }
    const totalRegistered =
        meta.total_registered ??
        meta.total ??
        0

    const handleTabChange = (tab) => {
        setSelectedTab(tab)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return
        setCurrentPage(page)
    }

    const invalidateRecipients = () => {
        queryClient.invalidateQueries({ queryKey: ["recipients"] })
    }

    const getEmptyMessage = () => {
        if (searchTerm.trim()) {
            return `No ${role} matching "${searchTerm}"`
        }
        return `No ${role} records found`
    }

    return (
        <div className="grid gap-4">
            <CardMetrics statusCounts={statusCounts} total={totalRegistered} />
            <Separator />
        <div className="grid gap-2">
            <Tabs
                value={selectedTab}
                onValueChange={handleTabChange}
            >
                <FieldGroup className="flex flex-row items-center justify-between">
                    <TabsList className="w-80">
                        <TabsTrigger value="Student">Students</TabsTrigger>
                        <TabsTrigger value="Faculty">Faculty</TabsTrigger>
                        <TabsTrigger value="Staff">Staff</TabsTrigger>
                    </TabsList>
                    <Field className="w-80">
                        <InputGroup>
                            <InputGroupInput
                                id="search"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <InputGroupAddon><Search /></InputGroupAddon>
                        </InputGroup>
                    </Field>
                </FieldGroup>
                <div className="overflow-hidden rounded-md border">
                    <Table className="p-0">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>ID Number</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email Address</TableHead>
                                <TableHead>Contact</TableHead>

                                {isStudentTab && (
                                    <>
                                        <TableHead>Year Level</TableHead>
                                        <TableHead>Program</TableHead>
                                    </>
                                )}

                                <TableHead>Status</TableHead>
                                <TableHead>Registered At</TableHead>
                                <TableHead className="text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columnCount}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader className="animate-spin" />
                                            <p>
                                                Loading recipients . . .
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : recipients.length > 0 ? (
                                recipients.map((recipient) => {
                                    const isActive =
                                        (recipient.status ?? "active") === "active"

                                    return (
                                        <TableRow key={recipient.id}>
                                            <TableCell>
                                                {recipient.id_number}
                                            </TableCell>
                                            <TableCell>
                                                {recipient.first_name}
                                            </TableCell>
                                            <TableCell>
                                                {recipient.last_name}
                                            </TableCell>
                                            <TableCell>
                                                {recipient.email}
                                            </TableCell>
                                            <TableCell>
                                                {recipient.contact_number}
                                            </TableCell>

                                            {isStudentTab && (
                                                <>
                                                    <TableCell>
                                                        {recipient.student_year}
                                                    </TableCell>
                                                    <TableCell>
                                                        {recipient.student_program}
                                                    </TableCell>
                                                </>
                                            )}

                                            <TableCell>
                                                <span
                                                    className={
                                                        isActive
                                                            ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                                                            : "inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400"
                                                    }
                                                >
                                                    {isActive
                                                        ? "Active"
                                                        : "Deactivated"}
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(
                                                    recipient.created_at
                                                )}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant={
                                                            isActive
                                                                ? "secondary"
                                                                : "safe"
                                                        }
                                                        size="icon"
                                                        title={
                                                            isActive
                                                                ? "Deactivate account"
                                                                : "Activate account"
                                                        }
                                                        onClick={() => setStatusTarget(recipient)}
                                                    >
                                                        {isActive ? (
                                                            <Ban />
                                                        ) : (
                                                            <CheckCircle2 />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        title="Delete account"
                                                        onClick={() => setDeleteTarget(recipient)}
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columnCount}>
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <CircleSlash />
                                            <p>
                                                {getEmptyMessage()}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Separator />

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
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            className={
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                    {[...Array(lastPage)].map((_, index) => {
                                        const page = index + 1
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
                                                            handlePageChange(
                                                                page
                                                            )
                                                        }
                                                        isActive={
                                                            currentPage ===
                                                            page
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        }
                                        return null
                                    })}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            className={
                                                currentPage === lastPage ||
                                                    lastPage === 0
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
            </Tabs>
        </div>

            <RecipientStatusDialog
                open={!!statusTarget}
                onOpenChange={(open) => {
                    if (!open) setStatusTarget(null)
                }}
                recipient={statusTarget}
                onSuccess={invalidateRecipients}
            />

            <RecipientDeleteDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null)
                }}
                recipient={deleteTarget}
                onSuccess={invalidateRecipients}
            />
        </div>
    )
}

export default RecipientTable