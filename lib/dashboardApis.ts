import { apiConnector } from "@/lib/apiConnector";
import { adminApis } from "@/lib/apis";
import { toast } from "sonner";
import { 
    setDashboardLoading, 
    setDashboardData, 
    setDashboardError 
} from "@/reducers/slices/dashboardSlice";

// Redux action for dashboard stats
export const getDashboardStatsAction = () => {
    return async (dispatch: any, getState: any) => {
        try {
            const state = getState();
            const token = state.auth?.token;

            if (!token) {
                toast.error("Authentication required: No token found");
                dispatch(setDashboardError("Authentication required"));
                return;
            }

            // Set loading state
            dispatch(setDashboardLoading(true));

            // Make API call
            const response = await apiConnector({
                method: "GET",
                url: adminApis.getDashboardStats,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            // Set data on success
            dispatch(setDashboardData(response.data.data));
            return response.data.data;
        } catch (error: any) {
            console.error("Error fetching dashboard stats:", error);
            toast.error("Failed to fetch dashboard stats");
            dispatch(setDashboardError(error.message || "Failed to fetch dashboard stats"));
            return {
                monthlyStats: [],
                monthlyFlatsStats: [],
                moneyCollectedStats: []
            };
        }
    };
};