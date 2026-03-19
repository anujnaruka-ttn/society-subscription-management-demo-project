import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResidentData } from "@/types/flatData";

interface FlatResidentsState {
    residents: ResidentData[];
    loading: boolean;
}

const initialState: FlatResidentsState = {
    residents: [],
    loading: false,
};

const flatResidentsSlice = createSlice({
    name: "flatResidents",
    initialState,
    reducers: {
        setResidents: (state, action: PayloadAction<ResidentData[]>) => {
            state.residents = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setResidents, setLoading } = flatResidentsSlice.actions;
export default flatResidentsSlice.reducer;
