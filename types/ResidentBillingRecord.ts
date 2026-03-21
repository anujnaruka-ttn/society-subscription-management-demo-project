import { ResidentData } from "./flatData";

export interface ResidentBillingRecord {
    id: string; // The billing_records table ID
    flat_id: string;
    billing_month: number;
    billing_year: number;
    amount_due: number;
    status: "paid" | "pending" | "overdue" | "cancelled";
    due_date: string | null;
    flat_address: string;
    flat_type: string;
    residents: ResidentData[];
    payment_mode: string | null;
    amount_paid: number | null;
    payment_status: string | null;
    transaction_id: string | null;
    payment_date: string | null;
}
