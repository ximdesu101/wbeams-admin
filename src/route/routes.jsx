import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "@/App";
import Login from "@/pages/auth/LoginForm";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import Logout from "@/pages/auth/Logout";
import NotFound from "@/pages/errors/NotFound";
import PageLoader from "@/components/common/PageLoader";

import AuthProtector from "@/route/guard/AuthProtector";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Emergency = lazy(() => import("@/pages/emergency/Emergency"));
const SentAlerts = lazy(() => import("@/pages/sentAlerts/SentAlerts"));
const ReportedIncidents = lazy(() => import("@/pages/reportedIncidents/ReportedIncidents"));
const AlertForm = lazy(() => import("@/pages/emergency/layouts/alert/AlertForm"));
const Recipients = lazy(() => import("@/pages/users/recipient/Recipients"));
const Masterlist = lazy(() => import("@/pages/users/masterlist/Masterlist"));
const MasterlistForm = lazy(() => import("@/pages/users/masterlist/layouts/MasterlistForm"));
const Operator = lazy(() => import("@/pages/operator/Operator"));
const OperatorDetails = lazy(() => import("@/pages/operator/layouts/OperatorDetails"));
const ComingSoon = lazy(() => import("@/pages/analytics/ComingSoon"));
const UserLogs = lazy(() => import("@/pages/audits/UserLogs"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const AccessRequestTable = lazy(() => import("@/pages/notification/AccessRequestTable"));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Login />
            },
        ],
    },
    {
        element: <AuthProtector />,
        children: [
            {
                element: <Sidebar />,
                children: [
                    { path: "dashboard", element: withSuspense(Dashboard), handle: { crumb: () => "Dashboard" } },
                    {
                        path: "emergency", handle: { crumb: () => "Emergency Categries" },
                        children: [
                            { index: true, element: withSuspense(Emergency) },
                            { path: "new-alert", element: withSuspense(AlertForm), handle: { crumb: () => "New Alerts" } }
                        ],
                    },
                    { path: "sent-alerts", element: withSuspense(SentAlerts), handle: { crumb: () => "Sent Alerts" } },
                    { path: "reported-incidents", element: withSuspense(ReportedIncidents), handle: { crumb: () => "Reported Incidents" } },
                    { path: "recipients", element: withSuspense(Recipients), handle: { crumb: () => "Recipients" } },
                    {
                        path: "user-masterlist", handle: { crumb: () => "User Masterlist" },
                        children: [
                            { index: true, element: withSuspense(Masterlist) },
                            { path: "new", element: withSuspense(MasterlistForm), handle: { crumb: () => "New Masterlist" } }
                        ],
                    },
                    {
                        path: "operator", handle: { crumb: () => "Operators" },
                        children: [
                            { index: true, element: withSuspense(Operator) },
                            { path: ":id", element: withSuspense(OperatorDetails), handle: { crumb: (params) => `Operator ${params.id}` } },
                        ],
                    },
                    { path: "coming-soon", element: withSuspense(ComingSoon), handle: { crumb: () => "Coming Soon" }  },
                    { path: "user-logs", element: withSuspense(UserLogs), handle: { crumb: () => "User Logs" } },
                    { path: "settings", element: withSuspense(Settings), handle: { crumb: () => "System Settings" } },
                    { path: "logout", element: <Logout /> },
                    { path: "access-requests", element: withSuspense(AccessRequestTable) }
                ],
            }
        ],
    },
    {
        path: "*",
        element: <NotFound />
    },
]);