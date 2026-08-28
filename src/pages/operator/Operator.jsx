import useDocumentTitle from "@/hooks/useDocumentTitle"
import OperatorTable from "./layouts/OperatorTable";

const Operator = () => {
    useDocumentTitle("NwSSU Alerts | Operator")
    return (
        <div>
            <OperatorTable />
        </div>
    );
};

export default Operator;