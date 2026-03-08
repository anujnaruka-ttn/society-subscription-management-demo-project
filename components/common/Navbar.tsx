"use client";

import { usePathname } from "next/navigation";
import ModeToggle from "./ModeToggle";

const Navbar = () => {
    const pathname = usePathname();
    const isAuthPage = pathname?.includes("login") || pathname?.includes("register");

    if (!isAuthPage) return null;

    return (
        <nav className="w-full h-[80px]">
            <div className="w-[80%] mx-auto flex items-center justify-end h-full">
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;