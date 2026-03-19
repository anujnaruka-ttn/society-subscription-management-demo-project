'use client'
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/reducers/slices/authSlice";

export default function NextAuthToReduxSync({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const { token } = useSelector((state: any) => state.auth);

    useEffect(() => {
        // If the session is authenticated via NextAuth but Redux doesn't have a token yet
        if (status === "authenticated" && session?.accessToken && !token) {
            // Sync NextAuth data back to Redux
            dispatch(setToken(session.accessToken as string));
            dispatch(setUser({
                ...session.user,
                profile_image: session.user?.image // Use profile_image to match backend
            }));
        }
    }, [session, status, token, dispatch]);

    return <>{children}</>;
}
