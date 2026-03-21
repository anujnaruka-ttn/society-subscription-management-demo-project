import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResidentBillingRecord } from "@/types/ResidentBillingRecord";

interface ResidentBillingState {
    records: ResidentBillingRecord[];
    loading: boolean;
}

const initialState: ResidentBillingState = {
    records: [],
    loading: false,
};

const residentBillingSlice = createSlice({
    name: "residentBilling",
    initialState,
    reducers: {
        setResidentBillingRecords: (state, action: PayloadAction<ResidentBillingRecord[]>) => {
            state.records = action.payload;
        },
        setResidentBillingLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setResidentBillingRecords, setResidentBillingLoading } = residentBillingSlice.actions;
export default residentBillingSlice.reducer;
