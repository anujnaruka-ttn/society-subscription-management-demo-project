const ALL_RESIDENTS = `SELECT * FROM users WHERE role = 'resident'`;

const GET_ALL_FLATS = `
    SELECT 
        f.id,
        f.flat_number,
        f.floor_number,
        f.flat_type,
        f.owner_id,
        f.resident_ids,
        f.is_active,
        f.created_at,
        f.updated_at,
        u.name as owner,
        u.email,
        u.phone_number as phone
    FROM flats f
    LEFT JOIN users u ON f.owner_id = u.id
    WHERE f.is_active = true
    ORDER BY f.floor_number, f.flat_number
`;

const INSERT_FLAT = `
    INSERT INTO flats (id, flat_number, floor_number, flat_type, owner_id, resident_ids, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
    RETURNING *
`;

const UPDATE_FLAT = `
    UPDATE flats 
    SET flat_number = $1, floor_number = $2, flat_type = $3, owner_id = $4, resident_ids = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING *
`;

const UPDATE_FLAT_RESIDENTS = `
    UPDATE flats 
    SET resident_ids = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
`;

const ADD_RESIDENT_TO_FLAT = `
    UPDATE flats 
    SET resident_ids = array_append(resident_ids, $1), updated_at = NOW()
    WHERE id = $2 AND NOT ($1 = ANY(resident_ids))
    RETURNING *
`;

const REMOVE_RESIDENT_FROM_FLAT = `
    UPDATE flats 
    SET resident_ids = array_remove(resident_ids, $1), updated_at = NOW()
    WHERE id = $2
    RETURNING *
`;

const UPDATE_USERS_FLAT_ID = `
    UPDATE users 
    SET flat_id = $1, updated_at = NOW()
    WHERE id = ANY($2)
`;

const INSERT_BILLING_RECORD = `
    INSERT INTO billing_records (id, flat_id, billing_month, billing_year, amount_due, status, due_date, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, EXTRACT(MONTH FROM NOW()), EXTRACT(YEAR FROM NOW()), $2, 'pending', NOW(), NOW(), NOW())
    RETURNING *
`;

const UPDATE_BILLING_FOR_USERS = `
    INSERT INTO billing_records (id, flat_id, user_id, billing_month, billing_year, amount_due, status, due_date, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, $2, EXTRACT(MONTH FROM NOW() + INTERVAL '1 month'), EXTRACT(YEAR FROM NOW() + INTERVAL '1 month'), $3, 'pending', NOW() + INTERVAL '31 days', NOW(), NOW())
    ON CONFLICT (user_id, billing_month, billing_year) 
    DO UPDATE SET amount_due = billing_records.amount_due + EXCLUDED.amount_due, updated_at = NOW()
`;

const GET_MONTHLY_RATE_BY_FLAT_TYPE = `
    SELECT monthly_rate FROM subscription_plans 
    WHERE flat_type = $1 AND is_active = true 
    ORDER BY effective_from DESC LIMIT 1
`;

const SOFT_DELETE_FLAT = `
    UPDATE flats 
    SET is_active = false, owner_id = NULL, resident_ids = '{}', updated_at = NOW()
    WHERE id = $1
    RETURNING *
`;

const GET_FLAT_BY_ID = `
    SELECT id, flat_number, floor_number, flat_type, owner_id, resident_ids, is_active, created_at, updated_at
    FROM flats 
    WHERE id = $1
`;

export {
    ALL_RESIDENTS,
    GET_ALL_FLATS,
    INSERT_FLAT,
    UPDATE_FLAT,
    UPDATE_FLAT_RESIDENTS,
    ADD_RESIDENT_TO_FLAT,
    REMOVE_RESIDENT_FROM_FLAT,
    SOFT_DELETE_FLAT,
    UPDATE_USERS_FLAT_ID,
    GET_FLAT_BY_ID,
    INSERT_BILLING_RECORD,
    UPDATE_BILLING_FOR_USERS,
    GET_MONTHLY_RATE_BY_FLAT_TYPE
};
