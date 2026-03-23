import { ResidentData } from "./flatData";

export interface ResidentBillingRecord {
    id: string;
    billing_month: number;
    billing_year: number;
    amount_due: number;
    status: "paid" | "pending" | "overdue" | "cancelled";
    due_date: string | null;
    flat_id: string;
    flat_address: string;
    flat_type: string;
    owner_id: string;
    owner_name: string;
    owner_email: string;
    owner_phone: string;
    residents: ResidentData[];
    payment_mode: string | null;
    amount_paid: number | null;
    payment_status: string | null;
    transaction_id: string | null;
    payment_date: string | null;
}
