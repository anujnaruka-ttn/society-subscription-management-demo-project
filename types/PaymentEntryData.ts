export interface PaymentEntryData {
    id: string;
    resident: string;
    email: string;
    phone: string;
    flatAddress: string;
    status: "paid" | "pending";
    paymentRecord?: "cash" | "upi";
}