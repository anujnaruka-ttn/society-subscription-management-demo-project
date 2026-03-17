export interface INotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type?: "payment_reminder" | "announcement" | "system";
    is_read?: boolean;
    created_at?: Date;
}