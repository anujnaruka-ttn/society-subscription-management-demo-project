export interface MonthlyRecords {
    id: string;
    resident: string;
    email: string;
    phone: string;
    flatAddress: string;
    paymentStatus: "paid" | "due";
}