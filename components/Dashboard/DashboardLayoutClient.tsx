"use client";

import AuthGuard from "../Auth/AuthGuard";
import HamBurger from "../common/HamBurger";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import DashboardSidebar from "./Sidebar/DashboardSidebar";

export default function DashboardLayoutClient({
    children,
    requiredRole,
}: {
    children: React.ReactNode;
    requiredRole?: "admin" | "resident";
}) {

    return (
        <AuthGuard requiredRole={requiredRole}>
            <SidebarProvider>
                <main className="relative flex h-dvh w-full overflow-hidden">
                    <DashboardSidebar />
                    <SidebarInset className="flex flex-col justify-center items-center">
                        {/* Mobile header */}
                        <HamBurger />
                        {children}
                    </SidebarInset>
                </main>
            </SidebarProvider>
        </AuthGuard>
    );
}

