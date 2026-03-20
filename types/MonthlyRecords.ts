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
    flat_number: string;
    floor_number: number;
    flat_type: string;
    owner_name: string;
    owner_email: string;
    owner_phone: string;
    flat_address: string;
}