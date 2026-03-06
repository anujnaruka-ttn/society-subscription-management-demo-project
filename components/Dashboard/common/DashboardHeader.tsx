"use client";

import { usePathname } from "next/navigation";

const DashboardHeader = () => {
    const pathname = usePathname();
    const currentPath = pathname.split("/")[pathname.split("/").length - 1];
    return (
        <header className="h-16 border-border rounded-xl p-1.5">
            <nav className="px-3 sm:px-6 flex items-center rounded-t-xl justify-between border-b border-border h-full capitalize">
                {currentPath}
            </nav>
        </header>
    );
}

export default DashboardHeader;