export interface FlatData {
    id: string;
    owner: string;
    email: string;
    phone: string;
    flatAddress: string;
    status: "completed" | "pending" | "processing" | "cancelled";
    amount: string;
    date: string;
}