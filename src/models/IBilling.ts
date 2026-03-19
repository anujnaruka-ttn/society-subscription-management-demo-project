import { query } from "../config/db";
import { CREATE_BILLING_RECORDS_TABLE } from "../queries/schemas";

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

export const initBilling = async () => {
    await query(CREATE_BILLING_RECORDS_TABLE);
    console.log("Billing records table initialized successfully");
};