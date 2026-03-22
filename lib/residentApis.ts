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
                toast.success(response.data.message);
            }
        } catch (error: any) {
            console.error("Full error:", error);
            toast.error(error.response?.data?.message || "Failed to fetch subscription records");
            console.error("Error fetching resident subscriptions:", error);
        } finally {
            dispatch(setResidentBillingLoading(false));
        }
    };
};

export const getResidentSubscriptionsByMonth = (month: string) => {
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
                url: residentApis.getResidentSubscriptionsByMonth(month),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                dispatch(setResidentBillingRecords(response.data.data));
                toast.success(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch subscription records");
            console.error("Error fetching resident subscriptions by month:", error);
        } finally {
            dispatch(setResidentBillingLoading(false));
        }
    };
};

export const setPaymentStatus = (paymentId: string, flatId: string, month?: string, year?: string) => {
    return async (dispatch: AppDispatch, getState: any) => {
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        try {
            const response = await apiConnector({
                method: apiMethods.PUT,
                url: residentApis.updatePaymentStatus,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    paymentId,
                    flatId,
                    month,
                    year,
                },
            });

            if (response.data.success) {
                toast.success("Payment status updated successfully!");
                // Refresh the subscription data after payment update
                dispatch(getResidentSubscriptions() as any);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update payment status");
            console.error("Error updating payment status:", error);
        }
    };
};
