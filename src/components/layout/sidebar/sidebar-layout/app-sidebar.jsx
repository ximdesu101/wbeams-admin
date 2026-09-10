import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileUp,
    Logs,
    RouteOff,
    FolderSync,
    ShieldCheck,
    Activity,
    UserRoundCog,
    ChartNoAxesCombined,
    Settings2,
    LogOut,
    Loader2,
    BellElectric,
} from "lucide-react";

import { NavMain } from "@/components/layout/sidebar/sidebar-layout/nav-main";
import { NavUser } from "@/components/layout/sidebar/sidebar-layout/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';

const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Emergency Management", url: "/emergency", icon: BellElectric },
    {
        title: "All Incidents",
        url: "#",
        icon: Activity,
        items: [
            { title: "Sent Alerts", url: "/sent-alerts" },
            { title: "Reported Incidents", url: "/reported-incidents" },
        ],
    },
    {
        title: "User Management",
        url: "#",
        icon: Users,
        items: [
            { title: "Registered Users", url: "/recipients" },
            { title: "User Masterlist", url: "/user-masterlist" },
        ],
    },
    { title: "Operator Management", url: "/operator", icon: UserRoundCog },
    { 
        title: "Reports and Analytics", url: "/report-analytics", icon: ChartNoAxesCombined },
    { title: "User Logs", url: "user-logs", icon: Logs },
    { title: "System Settings", url: "/settings", icon: Settings2 },
];

export function AppSidebar({ ...props }) {
    const [admin] = useState(() => {
        const stored = localStorage.getItem("admin");
        if (!stored) return null;

        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    });

    const user = admin
        ? {
            name: `${admin.first_name} ${admin.last_name}`,
            email: admin.email,
            avatar: admin.avatar ?? "/avatars/shadcn.jpg",
        }
        : {
            name: "Unknown Admin",
            email: "",
            avatar: "/avatars/shadcn.jpg",
        };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                                <img
                                    src="/favicon/favicon-96x96.png"
                                    alt="NwSSU Alert"
                                    className="size-6 object-contain"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">NwSSU Alert</span>
                                <span className="truncate text-xs text-muted-foreground">Emergency Alert System</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}