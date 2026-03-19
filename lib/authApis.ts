import { apiConnector } from "./apiConnector";
import { authApis, apiMethods } from "./apis";
import { setToken, setUser, logout as logOutReducer } from "@/reducers/slices/authSlice";
import { toast } from "sonner";
import { AppDispatch, persistor } from "@/stores/store";
import { signOut } from "next-auth/react";

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

            await signOut({ redirect: false });
            // 1. Clear Redux and Persistor FIRST
            // dispatch(setToken(null));
            // dispatch(setUser(null));
            dispatch(logOutReducer());
            try {
                await persistor.purge();
            } catch (purgeError) {
                console.warn("Purge failed:", purgeError);
            }
            navigate("/login");

        } catch (error: any) {
            console.error("Logout Error:", error);
            navigate("/login");
        }
    };
};