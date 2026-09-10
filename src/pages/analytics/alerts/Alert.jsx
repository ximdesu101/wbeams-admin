import { Button } from "@/components/ui/button";
import AlertChannel from "./layout/AlertChannel";
import AcknowledgeVia from "./layout/AcknowledgeVia";
import EmailDeliveryPerformance from "./layout/EmailDeliveryPerformance";
import EmailCardMetrics from "./layout/EmailCardMetrics";
import SMSCardMetrics from "./layout/SMSCardMetrics";
import SMSDeliveryPerformance from "./layout/SMSDeliveryPerformance";
import EmergencyCategory from "./layout/EmergencyCategory";
import ResponseMetrics from "./layout/ResponseMetrics";
import GeographicSummary from "./layout/GeographicSummary";
const Alert = () => {
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <AlertChannel />
                </div>
                <AcknowledgeVia />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <EmailCardMetrics />
                <div className="col-span-2">
                    <EmailDeliveryPerformance />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <SMSDeliveryPerformance />
                </div>
                <SMSCardMetrics />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <EmergencyCategory />
                <ResponseMetrics />
            </div>
            <GeographicSummary />
        </div>
    )
}

export default Alert