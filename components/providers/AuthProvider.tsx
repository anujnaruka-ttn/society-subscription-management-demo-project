'use client'
import { SessionProvider } from "next-auth/react"
import NextAuthToReduxSync from "./NextAuthToReduxSync"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NextAuthToReduxSync>
                {children}
            </NextAuthToReduxSync>
        </SessionProvider>
    )
}
