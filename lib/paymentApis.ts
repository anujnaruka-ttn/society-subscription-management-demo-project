import { setPaymentEntries, setPendingPayments } from "@/reducers/slices/adminPaymentSlice";
import { adminApis, apiMethods } from "./apis";
import { apiConnector } from "./apiConnector";
import { toast } from "sonner";

export const getPaymentEntries = () => {
    return async (dispatch: any, getState: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            if (!token) {
                toast.error("No token found - user not authenticated");
                return;
            }

            const response = await apiConnector({
                method: apiMethods.GET,
                url: adminApis.getPaymentEntries,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setPaymentEntries(response.data.data));
        } catch (error: any) {
            toast.error("Error fetching payment entries:", error);
        }
    }
}

export const getPendingPayments = () => {
    return async (dispatch: any, getState: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            if (!token) return;

            const response = await apiConnector({
                method: apiMethods.GET,
                url: adminApis.getPendingPayments,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setPendingPayments(response.data.data));
        } catch (error: any) {
            console.error("Error fetching pending payments:", error);
        }
    }
}

export const recordPayment = (data: {
    bill_id: string;
    flat_id: string;
    user_id: string;
    amount_paid: number;
    payment_mode: string;
    transaction_id?: string;
}) => {
    return async (dispatch: any, getState: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            if (!token) {
                toast.error("No token found - user not authenticated");
                return;
            }

            const response = await apiConnector({
                method: apiMethods.POST,
                url: adminApis.recordPayment,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                toast.success("Payment recorded successfully");
                // Refresh the entries
                dispatch(getPaymentEntries());
                return true;
            }
        } catch (error: any) {
            toast.error("Error recording payment:", error);
            return false;
        }
    }
}
