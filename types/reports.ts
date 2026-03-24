export interface ReportType {
    id: string;
    format: 'csv' | 'pdf';
    range: 'monthly' | 'yearly';
    month?: string;
    year?: string;
    generated_at: string;
    generated_by: string;
    generated_by_name?: string;
    generated_by_email?: string;
    file_name: string;
    file_path: string;
    file_size: number;
    status: 'completed' | 'failed' | 'expired';
    expires_at?: string;
    created_at: string;
    updated_at: string;
}