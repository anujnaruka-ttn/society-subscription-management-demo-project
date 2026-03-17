import { createSlice } from "@reduxjs/toolkit";

const isClient = typeof window !== "undefined";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: isClient ? localStorage.getItem("token") : null,
        user: isClient ? JSON.parse(localStorage.getItem("user") || "null") : null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            if (isClient) {
                if (action.payload) {
                    localStorage.setItem("token", action.payload);
                } else {
                    localStorage.removeItem("token");
                }
            }
        },
        setUser: (state, action) => {
            state.user = action.payload;
            if (isClient) {
                if (action.payload) {
                    localStorage.setItem("user", JSON.stringify(action.payload));
                } else {
                    localStorage.removeItem("user");
                }
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            if (isClient) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        },
    },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;