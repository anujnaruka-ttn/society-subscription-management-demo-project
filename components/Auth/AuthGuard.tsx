"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { toast } from "sonner"; // Use sonner directly

export default function AuthGuard({ children }: { children: ReactNode }) {
    const { token } = useSelector((state: any) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            toast.error("You are not logged in", { 
                position: "top-right",
                id: "auth-guard-redirect"
            });
            router.push("/login");
        }
    }, [token, router]);

    if (!token) {
        return null;
    }

    return <>{children}</>;
}