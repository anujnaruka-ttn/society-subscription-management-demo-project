"use client"

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export default function HamBurger() {
    const { isMobile, openMobile, setOpenMobile } = useSidebar();
        
    const handleClick = () => {
        setOpenMobile(!openMobile);
    };
    
    return (
        <>
        {isMobile && (
        <div className="p-3">
            <Button variant={"ghost"} onClick={handleClick}>
                <Menu />
            </Button>
        </div>
        )}
        </>
    );
}