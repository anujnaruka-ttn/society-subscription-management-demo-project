import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    paymentEntries: [],
    pendingPayments: [],
    loading: false,
};

const adminPaymentSlice = createSlice({
    name: "adminPayment",
    initialState,
    reducers: {
        setPaymentEntries: (state, action) => {
            state.paymentEntries = action.payload;
        },
        setPendingPayments: (state, action) => {
            state.pendingPayments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setPaymentEntries, setPendingPayments, setLoading } = adminPaymentSlice.actions;
export default adminPaymentSlice.reducer;
