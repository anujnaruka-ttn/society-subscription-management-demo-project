import { query } from "../config/db";
import { ISubscription } from "../models/ISubscription";
import { ALL_SUBSCRIPTIONS, UPDATE_MONTHLY_RATE } from "../queries/subscription.queries";
import { FlatType } from "../types/flatTypes";
import { UpdateSubscriptionInput } from "../validations/subscription.validation";

const getAllSubscriptions = async (): Promise<ISubscription[]> => {
    const result = await query(ALL_SUBSCRIPTIONS);
    return result.rows;
}

const updateSubscription = async (data: UpdateSubscriptionInput): Promise<ISubscription> => {
    const { flat_type, monthly_rate, effective_from } = data;
    
    // Convert Date object to YYYY-MM-DD string
    const dateString = effective_from.toISOString().split('T')[0];
    
    const result = await query(UPDATE_MONTHLY_RATE, [monthly_rate, dateString, flat_type]);
    return result.rows[0];
}

export {
    getAllSubscriptions,
    updateSubscription
}
