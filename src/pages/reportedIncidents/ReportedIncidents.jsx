import { Separator } from "@/components/ui/separator"
import useDocumentTitle from "@/hooks/useDocumentTitle"
import CardMetrics from "./layouts/CardMetrics"
import ReportTable from "./layouts/Table"

const ReportedIncidents = () => {
    useDocumentTitle("NwSSU Alerts | Reported Incidents")
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <Separator/>
            <ReportTable/>
        </div>
    )
}

export default ReportedIncidents