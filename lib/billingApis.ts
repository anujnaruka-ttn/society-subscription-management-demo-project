import { apiConnector } from "./apiConnector";
import { adminApis, apiMethods } from "./apis";
import { setBillingRecords, updateBillingRecord as updateBillingRecordAction, removeBillingRecord, setLoading } from "@/reducers/slices/billingSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/stores/store";

export const getAllBillingRecords = () => {
    return async (dispatch: AppDispatch, getState: any) => {

        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        dispatch(setLoading(true));

        try {
            const response = await apiConnector({
                method: apiMethods.GET,
                url: adminApis.billing,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                dispatch(setBillingRecords(response.data.data));
                toast.success("Billing records fetched successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch billing records");
            console.error("Error fetching billing records:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const getBillingRecordsByMonth = (month: number, year: number) => {
    return async (dispatch: AppDispatch, getState: any) => {

        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        dispatch(setLoading(true));

        try {
            const response = await apiConnector({
                method: apiMethods.GET,
                url: adminApis.billingByMonth(month, year),
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                dispatch(setBillingRecords(response.data.data));
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch billing records");
            console.error("Error fetching billing records:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const updateBillingStatus = (billingId: string, status: string) => {
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
                url: adminApis.updateBillingStatusCall(billingId, status),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                dispatch(updateBillingRecordAction(response.data.data));
                toast.success("Billing status updated successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update billing status");
            console.error("Error updating billing status:", error);
        }
    };
};

export const verifyPaymentForBill = async (billingId: string, token: string) => {
    try {
        const response = await apiConnector({
            method: apiMethods.GET,
            url: adminApis.verifyPayment(billingId),
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};

export const deleteBillingRecord = (billingId: string) => {
    return async (dispatch: AppDispatch, getState: any) => {

        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        try {
            const response = await apiConnector({
                method: apiMethods.DELETE,
                url: adminApis.deleteBillingRecord(billingId),
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                dispatch(removeBillingRecord(billingId));
                toast.success("Billing record deleted successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete billing record");
            console.error("Error deleting billing record:", error);
        }
    };
};
