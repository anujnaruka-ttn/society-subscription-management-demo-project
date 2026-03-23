import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResidentData, FlatData } from "@/types/flatData";

interface FlatState {
    residents: ResidentData[];
    flats: FlatData[];
    loading: boolean;
}

const initialState: FlatState = {
    residents: [],
    flats: [],
    loading: false,
};

const flatSlice = createSlice({
    name: "flat",
    initialState,
    reducers: {
        setResidents: (state, action: PayloadAction<ResidentData[]>) => {
            state.residents = action.payload;
        },
        addFlat: (state, action: PayloadAction<FlatData>) => {
            state.flats.push(action.payload);
        },
        setFlats: (state, action: PayloadAction<FlatData[]>) => {
            state.flats = action.payload;
        },
        updateFlat: (state, action: PayloadAction<FlatData>) => {
            const index = state.flats.findIndex(flat => flat.id === action.payload.id);
            if (index !== -1) {
                state.flats[index] = action.payload;
            }
        },
        removeFlat: (state, action: PayloadAction<string>) => {
            state.flats = state.flats.filter(flat => flat.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setResidents, addFlat, setFlats, updateFlat, removeFlat, setLoading } = flatSlice.actions;
export default flatSlice.reducer;
