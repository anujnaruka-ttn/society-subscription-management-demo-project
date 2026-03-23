export interface MonthlyRecords {
    id: string;
    billing_month: number;
    billing_year: number;
    amount_due: number;
    status: "pending" | "paid" | "overdue" | "cancelled";
    due_date: string;
    created_at: string;
    updated_at: string;
    flat_id: string;
    user_id: string;
    flat_number: string;
    floor_number: number;
    flat_type: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_role: string;
    flat_address: string;
}