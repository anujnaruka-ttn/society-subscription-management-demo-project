export interface IBilling {
    id: string;
    flat_id: string;
    billing_month: number;
    billing_year: number;
    amount_due: number;
    status?: "paid" | "pending" | "overdue";
    due_date: Date;
    created_at?: Date;
    updated_at?: Date;
}