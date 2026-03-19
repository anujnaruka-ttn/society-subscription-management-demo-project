import { query } from "../config/db";
import { CREATE_NOTIFICATIONS_TABLE } from "../queries/schemas";

export interface INotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type?: "payment_reminder" | "announcement" | "system";
    is_read?: boolean;
    created_at?: Date;
}

export const initNotifications = async () => {
    await query(CREATE_NOTIFICATIONS_TABLE);
    console.log("Notifications table initialized successfully");
};