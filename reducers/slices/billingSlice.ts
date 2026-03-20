import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MonthlyRecords } from "@/types/MonthlyRecords";

interface BillingState {
    billingRecords: MonthlyRecords[];
    loading: boolean;
}

const initialState: BillingState = {
    billingRecords: [],
    loading: false,
};

const billingSlice = createSlice({
    name: "billing",
    initialState,
    reducers: {
        setBillingRecords: (state, action: PayloadAction<MonthlyRecords[]>) => {
            state.billingRecords = action.payload;
        },
        updateBillingRecord: (state, action: PayloadAction<MonthlyRecords>) => {
            const index = state.billingRecords.findIndex(record => record.id === action.payload.id);
            if (index !== -1) {
                state.billingRecords[index] = action.payload;
            }
        },
        removeBillingRecord: (state, action: PayloadAction<string>) => {
            state.billingRecords = state.billingRecords.filter(record => record.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setBillingRecords, updateBillingRecord, removeBillingRecord, setLoading } = billingSlice.actions;
export default billingSlice.reducer;
