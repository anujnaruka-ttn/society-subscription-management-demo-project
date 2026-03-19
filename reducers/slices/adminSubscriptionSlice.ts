import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subscriptions: [],
    monthlyRate: 0,
}

const adminSubscriptionSlice = createSlice({
    name: "adminSubscription",
    initialState,
    reducers: {
        setSubscriptions: (state, action) => {
            state.subscriptions = action.payload;
        },
        setMonthlyRate: (state, action) => {
            state.monthlyRate = action.payload;
        }
    }
})

export const { setSubscriptions, setMonthlyRate } = adminSubscriptionSlice.actions;
export default adminSubscriptionSlice.reducer;