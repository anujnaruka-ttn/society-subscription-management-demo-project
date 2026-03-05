"use client";

import type React from "react";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ThemeSwitcherButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const ModeToggle = ({
    className,
    ...props
}: ThemeSwitcherButtonProps) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const isDark = theme === "dark";

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={cn("relative w-8 h-8 rounded-full overflow-hidden", className)}
            {...props}
        >
            <SunIcon
                className={`w-4 h-4 transition-all duration-300 ${isDark
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                    }`}
            />
            <MoonIcon
                className={`absolute w-4 h-4 transition-all duration-300 ${isDark
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                    }`}
            />
        </Button>
    );
}

export default ModeToggle;
