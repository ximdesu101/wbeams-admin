import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

const MasterlistCards = ({ roleCounts, total }) => {
    const cardMetrics = [
        {
            id: 1,
            title: "Total Users",
            value: total ?? 0,
        },
        {
            id: 2,
            title: "Number of Faculty",
            value: roleCounts?.faculty ?? 0,
        },
        {
            id: 3,
            title: "Number of Staff",
            value: roleCounts?.staff ?? 0,
        },
        {
            id: 4,
            title: "Number of Students",
            value: roleCounts?.student ?? 0,
        },
    ]

    return (
        <div className="grid grid-cols-4 auto-rows-min gap-4">
            {cardMetrics.map((data) => (
                <Card key={data.id} className="gap-0">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-base">
                            {data.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {data.value}
                        </h1>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default MasterlistCards