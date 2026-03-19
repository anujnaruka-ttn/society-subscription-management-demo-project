import { apiConnector } from "./apiConnector";
import { authApis, apiMethods } from "./apis";
import { toast } from "sonner";
import { AppDispatch } from "@/stores/store";
import { setUser } from "@/reducers/slices/authSlice";

// Upload profile image only
export const changeProfile = (profileImage: File) => {
    return async (dispatch: AppDispatch, getState: any) => {
        try {
            const state = getState();
            const token = state.auth?.token;

            if (!token) {
                toast.error("Authentication required: No token found");
                return;
            }

            if (!profileImage) {
                toast.error("Profile image is required");
                return;
            }

            const formData = new FormData();
            formData.append('profileImage', profileImage);

            const response = await apiConnector({
                method: apiMethods.PUT,
                url: authApis.changeProfile,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response?.data?.success) {
                toast.success("Profile image updated successfully");
                const updatedUser = response.data.data;
                dispatch(setUser(updatedUser));
                return updatedUser;
            } else {
                toast.error(response?.data?.message || "Failed to update profile image");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile image");
            console.error("Profile image update error:", error);
        }
    };
};

// Update name and phone number only
export const updateProfile = (data: { name?: string; phoneNumber?: string }) => {
    return async (dispatch: AppDispatch, getState: any) => {
        try {
            const state = getState();
            const token = state.auth?.token;

            if (!token) {
                toast.error("Authentication required: No token found");
                return;
            }

            const updateData: any = {};
            let hasData = false;

            if (data.name && data.name.trim()) {
                updateData.name = data.name.trim();
                hasData = true;
            }

            if (data.phoneNumber && data.phoneNumber.trim()) {
                updateData.phoneNumber = data.phoneNumber.trim();
                hasData = true;
            }

            // Validate that at least one field is provided
            if (!hasData) {
                toast.error("At least one field (name or phone number) is required to update");
                return;
            }

            const response = await apiConnector({
                method: apiMethods.PUT,
                url: authApis.updateProfile,
                data: updateData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response?.data?.success) {
                toast.success("Profile updated successfully");
                const updatedUser = response.data.data;
                dispatch(setUser(updatedUser));
                return updatedUser;
            } else {
                toast.error(response?.data?.message || "Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            console.error("Profile update error:", error);
        }
    };
};
