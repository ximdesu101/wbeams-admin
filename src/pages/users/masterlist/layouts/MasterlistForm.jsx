import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Manual from "./form/Manual";
import Bulk from "./form/Bulk";

const MasterlistForm = () => {
    return (
        <div className="grid gap-4">
            <Alert className="border-yellow-500 bg-yellow-50 text-yellow-800">
                <InfoIcon className="text-yellow-600" />
                <AlertTitle className="text-yellow-800">Heads up!</AlertTitle>
                <AlertDescription className="text-yellow-700">
                    Please choose only one method to proceed. You can either use the Manual Entry Form or the Bulk Upload.
                </AlertDescription>
            </Alert>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <Manual/>
                </div>
                <Bulk/>
            </div>
        </div>
    )
}

export default MasterlistForm