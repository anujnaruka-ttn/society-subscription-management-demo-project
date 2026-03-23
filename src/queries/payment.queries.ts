const GET_PAYMENT_ENTRIES = `
    SELECT 
        br.id as bill_id,
        br.amount_due,
        br.status as bill_status,
        br.billing_month,
        br.billing_year,
        f.id as flat_id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        u_billing.id as user_id,
        u_billing.name as user_name,
        u_billing.email as user_email,
        u_billing.phone_number as user_phone,
        u_owner.id as owner_id,
        u_owner.name as owner_name,
        u_owner.email as owner_email,
        u_owner.phone_number as owner_phone,
        CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number) as flat_address,
        p.id as payment_id,
        p.payment_mode,
        p.amount_paid,
        p.payment_date,
        p.payment_status,
        p.transaction_id,
        (
            SELECT json_agg(json_build_object(
                'id', u_res.id, 
                'name', u_res.name, 
                'profile_image', u_res.profile_image,
                'email', u_res.email
            ))
            FROM users u_res
            WHERE u_res.id = ANY(f.resident_ids)
        ) as residents
    FROM billing_records br
    LEFT JOIN flats f ON br.flat_id = f.id
    LEFT JOIN users u_billing ON br.user_id = u_billing.id
    LEFT JOIN users u_owner ON f.owner_id = u_owner.id
    LEFT JOIN payments p ON br.id = p.bill_id
    WHERE f.is_active = true
    ORDER BY br.billing_year DESC, br.billing_month DESC, f.floor_number, f.flat_number;
`;

const RECORD_PAYMENT = `
    INSERT INTO payments (id, bill_id, user_id, amount_paid, payment_mode, payment_status, transaction_id, payment_date, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, $2, $3, $4, 'success', $5, NOW(), NOW(), NOW())
    RETURNING *;
`;

const UPDATE_BILL_PAID = `
    UPDATE billing_records SET status = 'paid' WHERE flat_id = $1;
`;

const GET_PENDING_PAYMENTS = `
    SELECT 
        br.id,
        u.name as resident,
        u.email,
        u.phone_number as phone,
        concat('Floor ', f.floor_number, ', ', f.flat_number) as "flatAddress",
        br.status,
        br.amount_due as amount,
        br.billing_month,
        br.billing_year,
        f.flat_type,
        u_owner.name as owner_name,
        u_owner.email as owner_email,
        u_owner.phone_number as owner_phone,
        (
            SELECT json_agg(json_build_object(
                'id', ru.id,
                'name', ru.name,
                'email', ru.email,
                'profile_image', ru.profile_image
            ))
            FROM users ru
            WHERE ru.id = ANY(f.resident_ids)
        ) as residents
    FROM billing_records br
    JOIN flats f ON br.flat_id = f.id
    LEFT JOIN users u ON br.user_id = u.id
    LEFT JOIN users u_owner ON f.owner_id = u_owner.id
    WHERE br.status = 'pending'
    ORDER BY br.created_at DESC;
`;

export {
    GET_PAYMENT_ENTRIES,
    RECORD_PAYMENT,
    UPDATE_BILL_PAID,
    GET_PENDING_PAYMENTS
};
