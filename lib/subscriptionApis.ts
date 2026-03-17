import { setSubscriptions } from "@/reducers/adminSubscriptionSlice";
import { adminApis, apiMethods } from "./apis";
import { apiConnector } from "./apiConnector";

export const getSubscriptions = () => {
    return async (dispatch: any, getState: any) => {
        try {
            const { auth } = getState();
            const token = auth?.token;

            if (!token) {
                console.error("No token found - user not authenticated");
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
        } catch (error: any) {
            console.error("Error fetching subscriptions:", error);
        }
    }
}