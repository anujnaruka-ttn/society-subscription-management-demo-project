"use client"

import { logout } from "@/lib/authApis";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FadeLoader } from "react-spinners";
import { useToast } from "@/hooks/use-toast"

export default function LogOut() {

    const dispatch = useDispatch();
    const router = useRouter();
    const { error, success } = useToast();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await dispatch(logout(router.push) as any);
                success("Logout Successful");
            } catch (err: any) {
                error("Logout Failed", err.message);
            }
        };
        performLogout();
    }, [dispatch, router]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <FadeLoader color="hsl(var(--primary))" />
            <p className="text-muted-foreground animate-pulse font-medium">Logging out safely...</p>
        </div>
    )

}

