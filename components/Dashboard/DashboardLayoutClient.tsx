"use client";

import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import DashboardHeader from "./common/DashboardHeader";
import DashboardSidebar from "./Sidebar/DashboardSidebar";

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <main className="relative flex h-dvh w-full overflow-hidden">
                <DashboardSidebar />
                <SidebarInset className="flex flex-col">
                    <DashboardHeader />
                    {children}
                </SidebarInset>
            </main>
        </SidebarProvider>
    );
}
