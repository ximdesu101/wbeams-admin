import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from "@/components/ui/input-group"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Search,
    CircleSlash,
    PlusCircle,
    Loader,
    Edit,
    Trash2,
} from "lucide-react"

import MasterlistCards from "./MasterlistCards"
import MasterlistEditForm from "./MasterlistEditForm"
import MasterlistDeleteDialog from "./MasterlistDeleteDialog"

import { formatDate } from "@/lib/formatDate"
import { getMasterlists } from "@/services/masterlistService"

const tabToRole = {
    Student: "student",
    Faculty: "faculty",
    Staff: "staff",
}

const tableColumns = {
    student: [
        "ID Number",
        "First Name",
        "Last Name",
        "Program",
        "Year",
        "Uploaded At",
    ],
    faculty: [
        "ID Number",
        "First Name",
        "Last Name",
        "Uploaded At",
    ],
    staff: [
        "ID Number",
        "First Name",
        "Last Name",
        "Uploaded At",
    ],
}

const MasterlistTable = () => {
    const navigate = useNavigate()

    const [searchInput, setSearchInput] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTab, setSelectedTab] = useState("Student")
    const [currentPage, setCurrentPage] = useState(1)
    const [editTarget, setEditTarget] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)

    const role = tabToRole[selectedTab]

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput)
            setCurrentPage(1)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchInput])

    const {
        data: listData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["masterlists", currentPage, searchTerm, role],
        queryFn: () => getMasterlists(currentPage, searchTerm, role),
        placeholderData: (previousData) => previousData,
        staleTime: 15_000,
    })

    // Backend always returns global role_counts in meta — no second request needed
    const masterlists = listData?.data ?? []
    const lastPage = listData?.meta?.last_page ?? 1
    const roleCounts = listData?.meta?.role_counts ?? {}
    // Prefer unfiltered total when available; fall back to sum of role counts
    const total =
        listData?.meta?.role_counts
            ? (roleCounts.student ?? 0) + (roleCounts.faculty ?? 0) + (roleCounts.staff ?? 0)
            : (listData?.meta?.total ?? 0)

    useEffect(() => {
        if (isError) {
            toast.error("Failed to load masterlist data.")
        }
    }, [isError])

    const handleTabChange = (tab) => {
        setSelectedTab(tab)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return

        setCurrentPage(page)
    }

    const getEmptyMessage = () => {
        if (searchTerm.trim()) {
            return `No ${role} matching "${searchTerm}"`
        }

        return `No ${role} records found`
    }

    return (
        <div className="grid gap-4">
            <MasterlistCards
                roleCounts={roleCounts}
                total={total}
            />

            <Separator />

            <div className="grid gap-2">
                {/* Tabs + Search Section */}
                <div className="flex items-center justify-between">
                    <Tabs
                        value={selectedTab}
                        onValueChange={handleTabChange}
                    >
                        <TabsList className="w-80">
                            <TabsTrigger value="Student">
                                Students
                            </TabsTrigger>
                            <TabsTrigger value="Faculty">
                                Faculty
                            </TabsTrigger>
                            <TabsTrigger value="Staff">
                                Staff
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2">
                        <InputGroup className="w-80">
                            <InputGroupInput
                                id="search"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                            />

                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>

                        <Button
                            onClick={() =>
                                navigate("/user-masterlist/new")
                            }
                        >
                            <PlusCircle />
                            Add Users
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-md border">
                    <Table className="p-0">
                        <TableHeader className="bg-muted">
                            <TableRow>
                                {tableColumns[role].map((column) => (
                                    <TableHead key={column}>
                                        {column}
                                    </TableHead>
                                ))}

                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            tableColumns[role].length + 1
                                        }
                                    >
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader className="animate-spin" />
                                            <p>
                                                Loading masterlist . . .
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : masterlists.length > 0 ? (
                                masterlists.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            {user.id_number}
                                        </TableCell>

                                        <TableCell>
                                            {user.first_name}
                                        </TableCell>

                                        <TableCell>
                                            {user.last_name}
                                        </TableCell>

                                        {role === "student" && (
                                            <>
                                                <TableCell>
                                                    {user.student_program}
                                                </TableCell>

                                                <TableCell>
                                                    {user.student_year}
                                                </TableCell>
                                            </>
                                        )}

                                        <TableCell>
                                            {formatDate(user.created_at)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                variant="safe"
                                                onClick={() =>
                                                    setEditTarget(user)
                                                }
                                            >
                                                <Edit />
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    setDeleteTarget(user)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            tableColumns[role].length + 1
                                        }
                                    >
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
            </div>

            {/* Edit + Delete Dialogs */}
            <MasterlistEditForm
                key={editTarget?.id}
                open={!!editTarget}
                onOpenChange={(open) =>
                    !open && setEditTarget(null)
                }
                masterlist={editTarget}
            />

            <MasterlistDeleteDialog
                open={!!deleteTarget}
                onOpenChange={(open) =>
                    !open && setDeleteTarget(null)
                }
                masterlist={deleteTarget}
            />
        </div>
    )
}

export default MasterlistTable