import { apiConnector } from "./apiConnector";
import { authApis, apiMethods } from "./apis";
import { setToken, setUser } from "@/reducers/authSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/stores/store";

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
            dispatch(setToken(null));
            dispatch(setUser(null));
            navigate("/login");
            toast.success("Logout Successful");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Logout Failed");
        }
    };
};