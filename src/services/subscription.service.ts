import { query } from "../config/db";
import { ALL_SUBSCRIPTIONS } from "../queries/subscription.queries";

const getAllSubscriptions = async () => {
    const result = await query(ALL_SUBSCRIPTIONS);
    return result.rows;
}

export {
    getAllSubscriptions
}
