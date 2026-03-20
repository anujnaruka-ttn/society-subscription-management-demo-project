const ALL_SUBSCRIPTIONS = `
    SELECT DISTINCT ON (flat_type) * 
    FROM subscription_plans 
    ORDER BY flat_type, effective_from DESC;
`;
const UPDATE_MONTHLY_RATE = `UPDATE subscription_plans SET monthly_rate = $1, effective_from = $2 WHERE flat_type = $3 RETURNING *;`;
export {
    ALL_SUBSCRIPTIONS,
    UPDATE_MONTHLY_RATE
}