import { apiConnector } from "./apiConnector";
import { adminApis, apiMethods } from "./apis";
import { setResidents, addFlat as addFlatAction } from "@/reducers/slices/flatSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/stores/store";

export const getResidents = () => {

    return async (dispatch: AppDispatch, getState: any) => {
        
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }
        
        try {
            const response = await apiConnector({
                method: apiMethods.GET,
                url: adminApis.getResidents,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                dispatch(setResidents(response.data.data));
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch residents");
            console.error("Error fetching residents:", error);
        }
    };
};

export const addFlat = (flatData: any) => {
    return async (dispatch: AppDispatch, getState: any) => {
        
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }
        
        try {
            const response = await apiConnector({
                method: apiMethods.POST,
                url: adminApis.addFlat,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: flatData
            });

            if (response.data.success) {
                dispatch(addFlatAction(response.data.data));
                toast.success("Flat added successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add flat");
            console.error("Error adding flat:", error);
        }
    };
};
