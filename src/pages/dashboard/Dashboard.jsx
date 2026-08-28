import useDocumentTitle from "@/hooks/useDocumentTitle";
import DashboardMetrics from "./layouts/CardMetrics";
import OverallSentAlerts from "./layouts/OverallSentAlerts";
import RecentSentAlerts from "./layouts/RecentSentAlerts";
import RecentReports from "./layouts/RecentReports";
import QuickAction from "./layouts/QuickAction";

const Dashboard = () => {
    useDocumentTitle("NwSSU Alerts | Dashboard")
    return (
        <>
            <DashboardMetrics />
            <OverallSentAlerts/>
            <div className="grid grid-cols-2 gap-4">
                <RecentSentAlerts/>
                <RecentReports/>
            </div>
            <QuickAction />
        </>
    )
}

export default Dashboard