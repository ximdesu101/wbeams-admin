import useDocumentTitle from "@/hooks/useDocumentTitle"
import MasterlistTable from "./layouts/MasterlistTable";

const Masterlist = () => {
    useDocumentTitle("NwSSU Alerts | Masterlist")
    return (
        <div>
            <MasterlistTable />
        </div>
    );
};

export default Masterlist;