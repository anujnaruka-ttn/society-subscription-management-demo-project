"use client";

import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { DashboardSidebar } from "./Sidebar/DashboardSidebar";

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="relative flex h-dvh w-full">
                <DashboardSidebar />
                <SidebarInset className="flex flex-col">
                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
