"use client";

import ModeToggle from "@/components/common/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    CircleHelp,
    LogOut,
    Settings,
    User,
} from "lucide-react";

export default function NavFooter({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {

    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    return (
        <SidebarFooter className="p-4">
            <SidebarMenu className={`justify-between ${isCollapsed ? "flex-col items-center gap-y-3" : "flex-row items-center gap-x-3"}`}>
                <SidebarMenuItem>
                    <div className={`flex items-center ${isCollapsed ? "flex-col gap-y-2" : "flex-row gap-x-2"}`}>
                        <Avatar className="h-12 w-12 rounded-full">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-full">AN</AvatarFallback>
                        </Avatar>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CircleHelp
                                    size={16}
                                    aria-hidden="true"
                                    className="cursor-pointer opacity-60 hover:opacity-100"
                                />
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                className="py-1 px-2 m-2 max-w-[180px] border bg-popover text-popover-foreground"
                            >
                                <div className="space-y-1 text-xs">
                                    <p className="font-medium">
                                        {user.name}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <ModeToggle />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    );
}
