import useDocumentTitle from "@/hooks/useDocumentTitle"
import SentAlertTable from "./layouts/Table"
import CardMetrics from "./layouts/CardMetrics"
import { Separator } from "@/components/ui/separator"

const SentAlerts = () => {
    useDocumentTitle("NwSSU Alerts | Sent Alerts")
    return (
        <div className="grid gap-4">
            <CardMetrics/>
            <Separator/>
            <SentAlertTable/>
        </div>
    )
}

export default SentAlerts