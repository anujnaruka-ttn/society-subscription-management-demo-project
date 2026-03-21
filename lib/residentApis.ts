import { apiConnector } from "./apiConnector";
import { residentApis, apiMethods } from "./apis";
import { toast } from "sonner";
import { AppDispatch } from "@/stores/store";
import { setResidentBillingRecords, setResidentBillingLoading } from "@/reducers/slices/residentBillingSlice";

export const getResidentSubscriptions = () => {
    return async (dispatch: AppDispatch, getState: any) => {
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        dispatch(setResidentBillingLoading(true));

        try {
            const response = await apiConnector({
                method: apiMethods.GET,
                url: residentApis.getResidentSubscriptions,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                dispatch(setResidentBillingRecords(response.data.data));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch subscription records");
            console.error("Error fetching resident subscriptions:", error);
        } finally {
            dispatch(setResidentBillingLoading(false));
        }
    };
};
