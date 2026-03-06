"use client"

import ModeToggle from "./ModeToggle";

const Navbar = () => {
    return (
        <nav className="w-full h-[80px]">
            <div className="w-[80%] mx-auto flex items-center justify-end h-full">
                <ModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;