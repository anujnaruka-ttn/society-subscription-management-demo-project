"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: "admin" | "resident";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const { token, user } = useSelector((state: any) => state.auth);
    const router = useRouter();
    const { error } = useToast();

    useEffect(() => {
        // 1. Check if logged in
        if (!token || !user) {
            error("You are not logged in");
            router.push("/login");
            return;
        }

        // 2. Check Role if required
        if (requiredRole && user.role !== requiredRole) {
            error("Unauthorized access");
            router.push("/dashboard"); 
            // Instead of just /not-found, taking them to their own dashboard is often better, 
            // but the user suggested /not-found in a previous file. 
            // However, for admin routes, if it's not an admin, we should probably redirect away.
            // Let's stick to what's logical. Redirecting to user's dashboard or /login.
        }
    }, [token, user, requiredRole, router]);

    // Prevents flicker and unauthorized render
    if (!token || !user || (requiredRole && user.role !== requiredRole)) {
        return null;
    }

    return <>{children}</>;
}