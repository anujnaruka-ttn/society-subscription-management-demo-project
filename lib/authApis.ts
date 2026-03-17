import { apiConnector } from "./apiConnector";
import { authApis, apiMethods } from "./apis";
import { setToken, setUser } from "@/reducers/authSlice";
import { toast } from "sonner";
import { AppDispatch, persistor } from "@/stores/store";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";

export const login = (data: any, navigate: any) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await apiConnector({
                method: apiMethods.POST,
                url: authApis.login,
                data: data
            });

            console.log(response.data.data)

            if (response.data.success) {
                toast.success("Login Successful");
                dispatch(setToken(response.data.data.token));
                dispatch(setUser(response.data.data));
                navigate(response.data.data.role === "admin" ? "/admin/dashboard" : "/dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login Failed");
        }
    };
};

export const signup = (data: any, navigate: any) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await apiConnector({
                method: apiMethods.POST,
                url: authApis.signup,
                data: data
            });

            if (response.data.success) {
                toast.success("Registration Successful");
                dispatch(setToken(response.data.data.token));
                dispatch(setUser(response.data.data));
                navigate("/dashboard");
            }

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration Failed");
        }
    };
};

export const logout = (navigate: any) => {
    return async (dispatch: AppDispatch) => {
        try {
            // 1. Clear Redux state & LocalStorage
            dispatch(setToken(null));
            dispatch(setUser(null));
            await persistor.purge();

            // 2. Check if we have an active NextAuth (Google) session
            const session = await getServerSession();

            if (session) {
                // Google User: Let NextAuth handle the cleanup and redirect
                await signOut({ callbackUrl: "/login" });
            } else {
                // Normal User: Pure Redux logout, just navigate to login
                navigate("/login");
            }

            toast.success("Logout Successful");
        } catch (error: any) {
            console.error("Logout Error:", error);
            navigate("/login"); // Fallback
            toast.error("Logout Failed");
        }
    };
};