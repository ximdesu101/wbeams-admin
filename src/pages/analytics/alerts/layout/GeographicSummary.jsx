import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Search, CircleSlash } from "lucide-react"
import { getGeographicSummary } from "@/services/analyticsService"

const GeographicSummary = () => {
    const [allAreas, setAllAreas] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchInput, setSearchInput] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 5

    useEffect(() => {
        getGeographicSummary()
            .then((res) => setAllAreas(res.data))
            .catch(() => setAllAreas([]))
            .finally(() => setLoading(false))
    }, [])

    const filteredAreas = allAreas.filter((area) =>
        area.area.toLowerCase().includes(searchInput.toLowerCase())
    )

    const lastPage = Math.max(1, Math.ceil(filteredAreas.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const areas = filteredAreas.slice(startIndex, startIndex + itemsPerPage)

    const handleSearch = (value) => {
        setSearchInput(value)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return
        setCurrentPage(page)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Geographic / Area Summary</CardTitle>
                <CardDescription>
                    Emergency alert activity and response performance by campus location
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        Loading…
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Area</TableHead>
                                    <TableHead>Total Alerts</TableHead>
                                    <TableHead>Active Alerts</TableHead>
                                    <TableHead>Resolved</TableHead>
                                    <TableHead>Avg. Response</TableHead>
                                    <TableHead>Avg. Resolution</TableHead>
                                    <TableHead>Delivery Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {areas.length > 0 ? (
                                    areas.map((area) => (
                                        <TableRow key={area.id}>
                                            <TableCell>{area.area}</TableCell>
                                            <TableCell>{area.totalAlerts}</TableCell>
                                            <TableCell>{area.activeAlerts}</TableCell>
                                            <TableCell>{area.resolved}</TableCell>
                                            <TableCell>{area.responseTime}</TableCell>
                                            <TableCell>{area.resolutionTime}</TableCell>
                                            <TableCell>{area.deliveryRate}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <CircleSlash />
                                                <p>
                                                    {searchInput
                                                        ? `No areas matching "${searchInput}"`
                                                        : "No area data available"}
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
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                className={
                                                    currentPage === 1
                                                        ? "pointer-events-none opacity-50"
                                                        : "cursor-pointer"
                                                }
                                            />
                                        </PaginationItem>
                                        {[...Array(lastPage)].map((_, index) => {
                                            const page = index + 1
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
                                            )
                                        })}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
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
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default GeographicSummary
