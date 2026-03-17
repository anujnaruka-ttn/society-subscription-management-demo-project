import { apiConnector } from "./apiConnector";
import { authApis, apiMethods } from "./apis";
import { setToken, setUser } from "@/reducers/authSlice";
import { toast } from "sonner";
import { AppDispatch, persistor } from "@/stores/store";
import { signOut, getSession } from "next-auth/react";

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
            try {
                await persistor.purge();
            } catch (purgeError) {
                console.warn("Purge failed:", purgeError);
            }

            // 2. Check if we have an active NextAuth (Google) session
            const session = await getSession();

            if (session) {
                console.log("Signing out from NextAuth session...");
                await signOut({ callbackUrl: "/login" });
                toast.success("Logout Successful");
                return; // signOut will handle the redirect
            }

            // Navigate to login after everything is cleared
            toast.success("Logout Successful");
            navigate("/login");
        } catch (error: any) {
            console.error("Logout Error:", error);
            navigate("/login"); // Fallback
            toast.error("Logout Failed");
        }

    };
};