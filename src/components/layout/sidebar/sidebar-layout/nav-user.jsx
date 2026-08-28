import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
    Bell,
    ChevronsUpDown,
    LogOut,
    CircleUser,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { AdminLogout } from "@/services/authService";
import { getPendingAccessRequestCount } from "@/services/accessRequest"
import { Spinner } from "@/components/ui/spinner"

export function NavUser({ user }) {
    const { isMobile } = useSidebar()
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const { data: pendingData } = useQuery({
        queryKey: ["access-requests-pending-count"],
        queryFn: getPendingAccessRequestCount,
        staleTime: 15_000,
    });

    const pendingCount = pendingData?.pending_count ?? 0;

    const handleLogout = async () => {
        setLoggingOut(true);
        const token = localStorage.getItem("token");
        try {
            if (token) {
                await AdminLogout(token);
            }
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            navigate("/", { replace: true });
        }
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                                {pendingCount > 0 && (
                                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                                        {pendingCount > 9 ? "9+" : pendingCount}
                                    </span>
                                )}
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <CircleUser />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/access-requests")}>
                                    <Bell />
                                    Notifications
                                    {pendingCount > 0 && (
                                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                                            {pendingCount > 9 ? "9+" : pendingCount}
                                        </span>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    if (!loggingOut) handleLogout();
                                }}
                                disabled={loggingOut}
                            >
                                {loggingOut ? (
                                    <Spinner/>
                                ) : (
                                    <LogOut className="size-4" />
                                )}
                                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}