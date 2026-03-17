"use client"

import { logout } from "@/lib/authApis";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FadeLoader } from "react-spinners";


export default function LogOut() {

    const dispatch = useDispatch();
    const router = useRouter();
    const logoutInitiated = useRef(false);

    useEffect(() => {
        // Prevent duplicate logout (handles React StrictMode and re-renders)
        if (logoutInitiated.current) return;
        logoutInitiated.current = true;

        const performLogout = async () => {
            await dispatch(logout(router.push) as any);
        };
        performLogout();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <FadeLoader color="hsl(var(--primary))" />
            <p className="text-muted-foreground animate-pulse font-medium">Logging out safely...</p>
        </div>
    )

}

