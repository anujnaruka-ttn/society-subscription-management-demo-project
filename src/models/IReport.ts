import { query } from "../config/db";
import { CREATE_REPORT_RECORDS_TABLE } from "../queries/schemas";

export interface IReport {
    id: string;
    format: 'csv' | 'pdf';
    range: 'monthly' | 'yearly';
    month?: string;
    year?: string;
    generated_at: Date;
    generated_by: string;
    file_name: string;
    file_path: string;
    file_size: number;
    status: 'completed' | 'failed' | 'expired';
    expires_at?: Date;
    created_at: Date;
    updated_at: Date;
}

// Database initialization function
export const initReportRecords = async () => {
    
    await query(CREATE_REPORT_RECORDS_TABLE);
    console.log("Report records table initialized successfully");

};