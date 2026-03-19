import { setSubscriptions } from "@/reducers/slices/adminSubscriptionSlice";
import { adminApis, apiMethods } from "./apis";
import { apiConnector } from "./apiConnector";
import { toast } from "sonner";

export const getSubscriptions = () => {
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
                url: adminApis.getSubscriptions,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setSubscriptions(response.data.data));
            toast.success("Subscriptions fetched successfully");
        } catch (error: any) {
            toast.error("Error fetching subscriptions:", error.message);
        }
    }
}

export const updateMonthlyRate = (subscription_id: string, monthly_rate: number, flat_type: string) => {
    return async (dispatch: any, getState: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            if (!token) {
                toast.error("No token found - user not authenticated");
                return;
            }

            const response = await apiConnector({
                method: apiMethods.PUT,
                url: adminApis.updateSubscriptionRate,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    subscription_id,
                    flat_type: flat_type.toLowerCase(),
                    monthly_rate,
                    effective_from: (() => {
                        const d = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        return `${yyyy}-${mm}-01`; // e.g. "2026-04-01" — no UTC shift
                    })(),
                }
            });
            dispatch(setSubscriptions(response.data.data));
            toast.success("Monthly rate updated successfully");
        } catch (error: any) {
            toast.error("Error updating monthly rate:", error.message);
        }
    }
}
