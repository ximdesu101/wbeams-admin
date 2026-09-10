import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
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
} from "lucide-react";

const areaData = [
    {
        id: "AREA-001",
        area: "Gate Area",
        totalAlerts: 18,
        activeAlerts: 1,
        resolved: 17,
        responseTime: "3m 12s",
        resolutionTime: "14m 35s",
        deliveryRate: "98.2%",
    },
    {
        id: "AREA-002",
        area: "Registrar Office",
        totalAlerts: 12,
        activeAlerts: 0,
        resolved: 12,
        responseTime: "4m 05s",
        resolutionTime: "16m 28s",
        deliveryRate: "97.5%",
    },
    {
        id: "AREA-003",
        area: "Covercourt",
        totalAlerts: 24,
        activeAlerts: 2,
        resolved: 22,
        responseTime: "3m 48s",
        resolutionTime: "18m 12s",
        deliveryRate: "96.8%",
    },
    {
        id: "AREA-004",
        area: "Field",
        totalAlerts: 21,
        activeAlerts: 1,
        resolved: 20,
        responseTime: "4m 21s",
        resolutionTime: "19m 05s",
        deliveryRate: "95.9%",
    },
    {
        id: "AREA-005",
        area: "Computer Lab",
        totalAlerts: 9,
        activeAlerts: 0,
        resolved: 9,
        responseTime: "2m 56s",
        resolutionTime: "12m 44s",
        deliveryRate: "99.1%",
    },
    {
        id: "AREA-006",
        area: "Canteen Area",
        totalAlerts: 15,
        activeAlerts: 1,
        resolved: 14,
        responseTime: "3m 34s",
        resolutionTime: "15m 52s",
        deliveryRate: "97.2%",
    },
    {
        id: "AREA-007",
        area: "Agriculture Building",
        totalAlerts: 11,
        activeAlerts: 0,
        resolved: 11,
        responseTime: "4m 42s",
        resolutionTime: "20m 18s",
        deliveryRate: "94.8%",
    },
    {
        id: "AREA-008",
        area: "Nachura Hall Building",
        totalAlerts: 16,
        activeAlerts: 1,
        resolved: 15,
        responseTime: "3m 57s",
        resolutionTime: "17m 36s",
        deliveryRate: "96.5%",
    },
    {
        id: "AREA-009",
        area: "Research Office",
        totalAlerts: 7,
        activeAlerts: 0,
        resolved: 7,
        responseTime: "3m 18s",
        resolutionTime: "13m 27s",
        deliveryRate: "98.6%",
    },
    {
        id: "AREA-010",
        area: "Library",
        totalAlerts: 13,
        activeAlerts: 0,
        resolved: 13,
        responseTime: "3m 41s",
        resolutionTime: "15m 14s",
        deliveryRate: "97.9%",
    },
    {
        id: "AREA-011",
        area: "Old Library",
        totalAlerts: 8,
        activeAlerts: 1,
        resolved: 7,
        responseTime: "5m 06s",
        resolutionTime: "22m 03s",
        deliveryRate: "93.7%",
    },
]

const GeographicSummary = () => {
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const filteredAreas = areaData.filter((area) =>
        area.area.toLowerCase().includes(searchInput.toLowerCase())
    );

    const lastPage = Math.max(
        1,
        Math.ceil(filteredAreas.length / itemsPerPage)
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const areas = filteredAreas.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleSearch = (value) => {
        setSearchInput(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > lastPage) return;
        setCurrentPage(page);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Geographic / Area Summary</CardTitle>
                <CardDescription>
                    Emergency alert activity and response performance by campus location
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <CircleSlash />
                                        <p>
                                            No areas matching "{searchInput}"
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
                                            handlePageChange(currentPage - 1)
                                        }
                                        className={
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                                {[...Array(lastPage)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                isActive={currentPage === page}
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
            </CardContent>
        </Card>
    );
}

export default GeographicSummary;