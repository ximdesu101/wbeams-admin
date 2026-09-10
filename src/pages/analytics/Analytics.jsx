import { useLocation, useNavigate } from "react-router-dom";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    BellElectric,
    UserRoundCog,
    UsersRound
} from "lucide-react";
import Alert from "./alerts/Alert";

const Analytics = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentTab = location.pathname.split("/").pop();

    const activeTab =
        currentTab === "operators"
            ? "operator"
            : currentTab === "users"
                ? "user"
                : "alert";

    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => {
                if (value === "alert") {
                    navigate("/report-analytics/alerts");
                }

                if (value === "operator") {
                    navigate("/report-analytics/operators");
                }

                if (value === "user") {
                    navigate("/report-analytics/users");
                }
            }}
        >
            <TabsList className="w-full">
                <TabsTrigger value="alert">
                    <BellElectric />
                    Alert Reports
                </TabsTrigger>

                <TabsTrigger value="operator">
                    <UserRoundCog />
                    Operator Reports
                </TabsTrigger>

                <TabsTrigger value="user">
                    <UsersRound />
                    User Reports
                </TabsTrigger>
            </TabsList>

            <TabsContent value="alert">
                <Alert />
            </TabsContent>

            <TabsContent value="operator">
                <h1>This is operator content</h1>
            </TabsContent>

            <TabsContent value="user">
                <h1>This is user content</h1>
            </TabsContent>
        </Tabs>
    );
}

export default Analytics;