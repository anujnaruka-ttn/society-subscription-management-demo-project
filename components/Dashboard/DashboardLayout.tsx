import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { DashboardSidebar } from "./Sidebar/Sidebar";

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="relative flex h-dvh w-full">
                <DashboardSidebar />
                <SidebarInset className="flex flex-col" />
            </div>
        </SidebarProvider>
    );
}
