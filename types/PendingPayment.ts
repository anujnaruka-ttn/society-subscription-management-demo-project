export interface PendingPaymentData {
    id: string;
    resident: string;
    email: string;
    phone: string;
    flatAddress: string;
    status: "paid" | "pending";
}