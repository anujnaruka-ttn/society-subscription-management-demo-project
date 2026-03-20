const GET_ALL_BILLING_RECORDS = `
    SELECT 
        br.id,
        br.billing_month,
        br.billing_year,
        br.amount_due,
        br.status,
        br.due_date,
        br.created_at,
        br.updated_at,
        br.flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        u.name as owner_name,
        u.email as owner_email,
        u.phone_number as owner_phone,
        CASE 
            WHEN f.owner_id IS NOT NULL THEN CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
            ELSE CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
        END as flat_address
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN users u ON f.owner_id = u.id
    WHERE f.is_active = true
    ORDER BY br.billing_year DESC, br.billing_month DESC, f.floor_number, f.flat_number
`;

const GET_BILLING_RECORDS_BY_MONTH = `
    SELECT 
        br.id,
        br.billing_month,
        br.billing_year,
        br.amount_due,
        br.status,
        br.due_date,
        br.created_at,
        br.updated_at,
        br.flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        u.name as owner_name,
        u.email as owner_email,
        u.phone_number as owner_phone,
        CASE 
            WHEN f.owner_id IS NOT NULL THEN CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
            ELSE CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
        END as flat_address
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN users u ON f.owner_id = u.id
    WHERE f.is_active = true 
    AND br.billing_month = $1 
    AND br.billing_year = $2
    ORDER BY f.floor_number, f.flat_number
`;

const UPDATE_BILLING_STATUS = `
    UPDATE billing_records 
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
`;

const SOFT_DELETE_BILLING_RECORD = `
    UPDATE billing_records 
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = $1
    RETURNING *
`;

const CHECK_PAYMENT_EXISTS = `
    SELECT * FROM payments 
    WHERE bill_id = $1 AND payment_status = 'success' 
    LIMIT 1
`;

export {
    GET_ALL_BILLING_RECORDS,
    GET_BILLING_RECORDS_BY_MONTH,
    UPDATE_BILLING_STATUS,
    SOFT_DELETE_BILLING_RECORD,
    CHECK_PAYMENT_EXISTS
};
