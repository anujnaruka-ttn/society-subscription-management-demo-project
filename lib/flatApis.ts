import { apiConnector } from "./apiConnector";
import { adminApis, apiMethods } from "./apis";
import { setResidents } from "@/reducers/flatResidentsSlice";
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
