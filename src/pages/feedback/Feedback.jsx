import useDocumentTitle from "@/hooks/useDocumentTitle"
import CardMetrics from "./layout/CardMetrics"
import RatingBreakdown from "./layout/RatingBreakdown"
import Helpfulness from "./layout/Helpfulness"
import FeedbackTable from "./layout/FeedbackTable"

const Feedback = () => {
    useDocumentTitle("NwSSU Alerts | Feedback and Ratings")

    return (
        <div className="grid gap-4">
            <CardMetrics />
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <RatingBreakdown />
                </div>
                <Helpfulness />
            </div>
            <FeedbackTable />
        </div>
    )
}

export default Feedback