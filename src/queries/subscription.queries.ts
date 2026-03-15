const ALL_SUBSCRIPTIONS = `SELECT * FROM subscription_plans;`;
const UPDATE_MONTHLY_RATE = `UPDATE subscription_plans SET monthly_rate = $1, effective_from = $2 WHERE flat_type = $3 RETURNING *;`;
export {
    ALL_SUBSCRIPTIONS,
    UPDATE_MONTHLY_RATE
}