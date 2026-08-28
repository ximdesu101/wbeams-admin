import { useState } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import CardMetrics from "./layouts/CardMetrics";
import EmergencyCategory from "./layouts/EmergencyCategory";
import AlertType from "./layouts/AlertType";

const Emergency = () => {
    useDocumentTitle("NwSSU Alerts | Emergency")
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <>
            <CardMetrics />
            <div className="grid md:grid-cols-3 gap-4">
                <EmergencyCategory
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                />
                <div className="col-span-2">
                    <AlertType selectedCategoryId={selectedCategoryId} />
                </div>
            </div>
        </>
    );
};

export default Emergency