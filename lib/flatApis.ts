import { apiConnector } from "./apiConnector";
import { adminApis, apiMethods } from "./apis";
import { setResidents, setFlats, addFlat as addFlatAction, removeFlat, updateFlat as updateFlatAction } from "@/reducers/slices/flatSlice";
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

export const getFlats = () => {
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
                url: adminApis.getFlats,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                dispatch(setFlats(response.data.data));
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch flats");
            console.error("Error fetching flats:", error);
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

export const deleteFlat = (flatId: string) => {
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
                url: adminApis.deleteFlat(flatId),
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                dispatch(removeFlat(flatId));
                toast.success("Flat deleted successfully");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete flat");
            console.error("Error deleting flat:", error);
        }
    };
};

export const updateFlat = (flatId: string, flatData: any) => {
    return async (dispatch: AppDispatch, getState: any) => {
        try {
            const state = getState();
            const token = state.auth?.token;

            const response = await apiConnector({
                url: adminApis.updateFlat(flatId),
                method: apiMethods.PUT,
                data: flatData,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                toast.success("Flat updated successfully");
                dispatch(updateFlatAction(response.data.data));
                dispatch(getFlats());
                return response.data.data;
            } else {
                toast.error(response.data.message || "Failed to update flat");
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to update flat");
            throw error;
        }
    };
};

export const changeFlatType = (flatId: string, flatType: string) => {
    return async (dispatch: AppDispatch, getState: any) => {
        try {
            const state = getState();
            const token = state.auth?.token;

            const response = await apiConnector({
                url: adminApis.changeFlatType(flatId),
                method: apiMethods.PATCH,
                data: { flat_type: flatType },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                toast.success("Flat type changed successfully");
                dispatch(updateFlatAction(response.data.data));
                dispatch(getFlats());
                return response.data.data;
            } else {
                toast.error(response.data.message || "Failed to change flat type");
                throw new Error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Failed to change flat type");
            throw error;
        }
    };
};
