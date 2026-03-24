import { apiConnector } from './apiConnector';
import { toast } from 'sonner';
import { adminApis, apiMethods } from './apis';
import { AppDispatch } from '@/stores/store';
import { setReports, setLoading, setError } from '@/reducers/slices/reportSlice';

export interface ReportParams {
    format: 'csv' | 'pdf';
    range: 'monthly' | 'yearly';
    month?: string;
    year?: string;
}

export const generateReport = (params: ReportParams) => {
    return async (_dispatch: AppDispatch, getState: any) => {
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        try {
            const response = await apiConnector({
                method: apiMethods.POST,
                url: adminApis.generateReport,
                data: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    responseType: 'blob',
                },
            });
            console.log(response);
            
            // Handle file download
            if (response.data) {
                // Get the content type from response headers
                const contentType = response.headers['content-type'];
                const contentDisposition = response.headers['content-disposition'];
                
                // Extract filename from content-disposition header
                let filename = `report.${params.format}`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (filenameMatch) {
                        filename = filenameMatch[1];
                    }
                }

                // Create blob from response data
                const blob = new Blob([response.data], { type: contentType });
                
                // Create download URL
                const url = window.URL.createObjectURL(blob);
                
                // Create temporary link and trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                toast.success('Report generated and downloaded successfully!');
            }
        } catch (error: any) {
            console.error('Error generating report:', error);
            
            // Handle different error types
            if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || 'Invalid parameters provided';
                toast.error(errorMessage);
            } else if (error.response?.status === 401) {
                toast.error('You are not authorized to generate reports');
            } else if (error.response?.status === 403) {
                toast.error('You do not have permission to generate reports');
            } else if (error.response?.status === 500) {
                toast.error('Server error occurred while generating report');
            } else {
                toast.error('Failed to generate report. Please try again.');
            }
            
            throw error;
        }
    };
};

// Add this to reportApi.ts
export const previewReport = (params: ReportParams) => {
    return async (_dispatch: AppDispatch, getState: any) => {
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            toast.error("Authentication required: No token found");
            return;
        }

        try {
            const response = await apiConnector({
                method: apiMethods.POST,
                url: adminApis.generateReport,
                data: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    responseType: 'blob',
                },
            });

            // Get the content type from response headers
            const contentType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: contentType });
            
            // Create URL and open in new tab
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            
            // Clean up after a delay
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
            
            toast.success('Report preview opened in new tab!');
        } catch (error: any) {
            console.error('Error previewing report:', error);
            toast.error('Failed to preview report');
            throw error;
        }
    };
};

// Helper function to get current month/year for default values
export const getCurrentReportParams = (): Omit<ReportParams, 'format'> => {
    const now = new Date();
    return {
        range: 'monthly',
        month: (now.getMonth() + 1).toString(),
        year: now.getFullYear().toString(),
    };
};

// Helper function to validate report parameters
export const validateReportParams = (params: Partial<ReportParams>): string[] => {
    const errors: string[] = [];
    
    if (!params.format || !['csv', 'pdf'].includes(params.format)) {
        errors.push('Format must be either csv or pdf');
    }
    
    if (!params.range || !['monthly', 'yearly'].includes(params.range)) {
        errors.push('Range must be either monthly or yearly');
    }
    
    if (params.range === 'monthly' && !params.month) {
        errors.push('Month is required for monthly reports');
    }
    
    if (params.month && (!/^(0?[1-9]|1[0-2])$/.test(params.month))) {
        errors.push('Month must be between 1 and 12');
    }
    
    if (params.year && !/^\d{4}$/.test(params.year)) {
        errors.push('Year must be a 4-digit number');
    }
    
    return errors;
};

// Fetch report records
export const getReportRecords = () => {
    return async (dispatch: AppDispatch, getState: any) => {
        const state = getState();
        const token = state.auth?.token;

        if (!token) {
            dispatch(setError("Authentication required: No token found"));
            return;
        }

        try {
            dispatch(setLoading(true));
            
            const response = await apiConnector({
                method: apiMethods.GET,
                url: adminApis.generateReport + '/records',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                dispatch(setReports(response.data.data));
                return response.data.data;
            } else {
                dispatch(setError(response.data.message || 'Failed to fetch report records'));
                throw new Error(response.data.message || 'Failed to fetch report records');
            }
        } catch (error: any) {
            console.error('Error fetching report records:', error);
            dispatch(setError(error.response?.data?.message || 'Failed to fetch report records'));
            toast.error(error.response?.data?.message || 'Failed to fetch report records');
            throw error;
        }
    };
};