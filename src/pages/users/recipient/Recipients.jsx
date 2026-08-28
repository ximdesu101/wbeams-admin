import useDocumentTitle from "@/hooks/useDocumentTitle"
import RecipientTable from "./layouts/RecipientTable"

const Recipients = () => {
    useDocumentTitle("NwSSU Alerts | Registered Recipients")
    return (
        <div className="grid gap-4">
            <RecipientTable />
        </div>
    )
}

export default Recipients