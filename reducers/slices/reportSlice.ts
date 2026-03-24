import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReportType } from '@/types/reports';

interface ReportState {
    reports: ReportType[];
    loading: boolean;
    error: string | null;
}

const initialState: ReportState = {
    reports: [],
    loading: false,
    error: null,
};

const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        setReports: (state, action: PayloadAction<ReportType[]>) => {
            state.reports = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        addReport: (state, action: PayloadAction<ReportType>) => {
            state.reports.unshift(action.payload);
        },
        removeReport: (state, action: PayloadAction<string>) => {
            state.reports = state.reports.filter(report => report.id !== action.payload);
        },
    },
});

export const { setReports, setLoading, setError, addReport, removeReport } = reportSlice.actions;
export default reportSlice.reducer;