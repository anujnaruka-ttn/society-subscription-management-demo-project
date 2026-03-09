export interface PaymentEntryData {
    id: string;
    resident: string;
    flatAddress: string;
    status: "paid" | "pending";
    paymentRecord?: "cash" | "upi";
}