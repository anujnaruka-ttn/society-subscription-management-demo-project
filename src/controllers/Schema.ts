import { query } from "../config/db";
import { CREATE_ENUMS } from "../queries/schemas";
import { initUsers } from "../models/IUser";
import { initFlats } from "../models/IFlat";
import { initSubscriptions } from "../models/ISubscription";
import { initBilling } from "../models/IBilling";
import { initPayments } from "../models/IPayment";
import { initNotifications } from "../models/INotification";

export const initEnums = async () => {
    await query(CREATE_ENUMS);
    console.log("ENUM types initialized successfully");
};

export const migrate = async () => {
    console.log("Starting database migration...");
    try {
        await initEnums();
        await initUsers();
        await initFlats();
        await initSubscriptions();
        await initBilling();
        await initPayments();
        await initNotifications();
        console.log("Database migration completed successfully");
    } catch (error) {
        console.error("Database migration failed:", error);
    }
};

