import { query } from "../config/db";
import { CREATE_PAYMENTS_TABLE } from "../queries/schemas";

export interface IPayment {
    id: string;
    bill_id: string;
    user_id: string;
    amount_paid: number;
    payment_mode: "cash" | "upi" | "online_razorpay" | "online_stripe";
    transaction_id?: string;
    payment_status?: "success" | "failed" | "pending";
    receipt_url?: string;
    remarks?: string;
    payment_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export const initPayments = async () => {
    await query(CREATE_PAYMENTS_TABLE);
    console.log("Payments table initialized successfully");
};