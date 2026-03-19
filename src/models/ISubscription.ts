import { query } from "../config/db";
import { CREATE_SUBSCRIPTION_PLANS_TABLE } from "../queries/schemas";
import { FlatType } from "../types/flatTypes";

export interface ISubscription {
    id: string;
    flat_type: FlatType;
    monthly_rate: number;
    effective_from: Date;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export const initSubscriptions = async () => {
    await query(CREATE_SUBSCRIPTION_PLANS_TABLE);
    console.log("Subscription plans table initialized successfully");
};