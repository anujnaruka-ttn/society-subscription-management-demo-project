"use client";

import AuthGuard from "../Auth/AuthGuard";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import DashboardSidebar from "./Sidebar/DashboardSidebar";

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <main className="relative flex h-dvh w-full overflow-hidden">
                    <DashboardSidebar />
                    <SidebarInset className="flex flex-col">
                        {children}
                    </SidebarInset>
                </main>
            </SidebarProvider>
        </AuthGuard>
    );
}
