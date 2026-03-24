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
        br.user_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        u.name as user_name,
        u.email as user_email,
        u.phone_number as user_phone,
        u.role as user_role,
        CASE 
            WHEN f.owner_id IS NOT NULL THEN CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
            ELSE CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
        END as flat_address
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN users u ON br.user_id = u.id
    WHERE f.is_active = true
    ORDER BY br.billing_year DESC, br.billing_month DESC, f.floor_number, f.flat_number, u.name
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
        br.user_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        u.name as user_name,
        u.email as user_email,
        u.phone_number as user_phone,
        u.role as user_role,
        CASE 
            WHEN f.owner_id IS NOT NULL THEN CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
            ELSE CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number)
        END as flat_address
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN users u ON br.user_id = u.id
    WHERE f.is_active = true 
    AND br.billing_month = $1 
    AND br.billing_year = $2
    ORDER BY f.floor_number, f.flat_number, u.name
`;

const UPDATE_BILLING_STATUS = `
    WITH updated AS (
        UPDATE billing_records 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
    )
    SELECT 
        u.id,
        u.billing_month,
        u.billing_year,
        u.amount_due,
        u.status,
        u.due_date,
        u.created_at,
        u.updated_at,
        u.flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        usr.name as owner_name,
        usr.email as owner_email,
        usr.phone_number as owner_phone,
        f.owner_id as owner_id,
        CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number) as flat_address
    FROM updated u
    LEFT JOIN flats f ON u.flat_id = f.id
    LEFT JOIN users usr ON f.owner_id = usr.id;
`;

const SOFT_DELETE_BILLING_RECORD = `
    WITH updated AS (
        UPDATE billing_records 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1
        RETURNING *
    )
    SELECT 
        u.id,
        u.billing_month,
        u.billing_year,
        u.amount_due,
        u.status,
        u.due_date,
        u.created_at,
        u.updated_at,
        u.flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        usr.name as owner_name,
        usr.email as owner_email,
        usr.phone_number as owner_phone,
        f.owner_id as owner_id,
        CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number) as flat_address
    FROM updated u
    LEFT JOIN flats f ON u.flat_id = f.id
    LEFT JOIN users usr ON f.owner_id = usr.id;
`;

const CHECK_PAYMENT_EXISTS = `
    SELECT * FROM payments 
    WHERE bill_id = $1 AND payment_status = 'success' 
    LIMIT 1
`;

const GET_BILLING_RECORDS_BY_FLAT = `
    SELECT
        br.id,
        br.billing_month,
        br.billing_year,
        br.amount_due,
        br.status,
        br.due_date,
        br.flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        (
            SELECT json_agg(json_build_object(
                'id', ru.id,
                'name', ru.name,
                'email', ru.email,
                'profile_image', ru.profile_image
            ))
            FROM users ru
            WHERE ru.id = ANY(f.resident_ids)
        ) as residents,
        CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number) as flat_address,
        p.payment_mode,
        p.amount_paid,
        p.payment_status,
        p.transaction_id,
        p.payment_date
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN payments p ON p.bill_id = br.id AND p.payment_status = 'success'
    WHERE f.owner_id = $1
    ORDER BY br.billing_year DESC, br.billing_month DESC
`;

const GET_BILLING_RECORDS_BY_FLAT_AND_MONTH = `
    SELECT
        br.id,
        br.billing_month,
        br.billing_year,
        br.amount_due,
        br.status,
        br.due_date,
        br.flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        (
            SELECT json_agg(json_build_object(
                'id', ru.id,
                'name', ru.name,
                'email', ru.email,
                'profile_image', ru.profile_image
            ))
            FROM users ru
            WHERE ru.id = ANY(f.resident_ids)
        ) as residents,
        CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number) as flat_address,
        p.payment_mode,
        p.amount_paid,
        p.payment_status,
        p.transaction_id,
        p.payment_date
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN payments p ON p.bill_id = br.id AND p.payment_status = 'success'
    WHERE f.owner_id = $1 AND br.billing_year = $2 AND br.billing_month = $3
    ORDER BY br.billing_year DESC, br.billing_month DESC
`;

export {
    GET_ALL_BILLING_RECORDS,
    GET_BILLING_RECORDS_BY_MONTH,
    UPDATE_BILLING_STATUS,
    SOFT_DELETE_BILLING_RECORD,
    CHECK_PAYMENT_EXISTS,
    GET_BILLING_RECORDS_BY_FLAT,
    GET_BILLING_RECORDS_BY_FLAT_AND_MONTH
};
