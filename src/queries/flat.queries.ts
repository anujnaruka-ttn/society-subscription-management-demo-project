const ALL_RESIDENTS = `SELECT * FROM users WHERE role = 'resident'`;

const INSERT_FLAT = `
    INSERT INTO flats (id, flat_number, floor_number, flat_type, owner_id, resident_ids, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW())
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
    VALUES (gen_random_uuid(), $1, EXTRACT(MONTH FROM NOW()), EXTRACT(YEAR FROM NOW()), 0, 'pending', NOW(), NOW(), NOW())
    RETURNING *
`;

export {
    ALL_RESIDENTS,
    INSERT_FLAT,
    UPDATE_FLAT_RESIDENTS,
    ADD_RESIDENT_TO_FLAT,
    REMOVE_RESIDENT_FROM_FLAT,
    UPDATE_USERS_FLAT_ID,
    INSERT_BILLING_RECORD
}
