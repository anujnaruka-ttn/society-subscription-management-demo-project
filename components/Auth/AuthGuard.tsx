"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

import { useSession } from "next-auth/react";

interface AuthGuardProps {
    children: ReactNode;
    requiredRole?: "admin" | "resident";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const { token, user } = useSelector((state: any) => state.auth);
    const { data: session, status } = useSession();
    const router = useRouter();
    const { error } = useToast();

    useEffect(() => {
        // Wait for session to load
        if (status === "loading") return;

        // Check if neither Redux nor NextAuth has a user
        const isAuthenticated = !!token || status === "authenticated";

        if (!isAuthenticated) {
            error("You are not logged in");
            router.push("/login");
            return;
        }

        // Role Check
        const currentRole = user?.role || (session?.user as any)?.role;
        if (requiredRole && currentRole !== requiredRole) {
            error("Unauthorized access");
            router.push("/dashboard");
        }
    }, [token, user, status, session, requiredRole, router]);

    // Prevents flicker and unauthorized render
    if (status === "loading") {
        return null; // Or a loading spinner
    }

    const currentRole = user?.role || (session?.user as any)?.role;
    if ((!token && status !== "authenticated") || (requiredRole && currentRole !== requiredRole)) {
        return null;
    }

    return <>{children}</>;
}