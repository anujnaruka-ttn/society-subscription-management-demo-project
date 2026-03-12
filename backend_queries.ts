import { Pool } from 'pg';

const pool = new Pool({
    // Your database connection config here
});

// ==========================================
// 1. ADD NEW FLAT
// ==========================================
export const createNewFlat = async (
    flatId: string,
    flatNumber: string,
    floorNumber: number,
    flatType: string,
    ownerId: string,
    residentIds: string[] // Array from frontend
) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1(a). Create the Flat
        // In pg, passing an array directly maps to a Postgres array
        await client.query(
            `INSERT INTO flats (id, flat_number, floor_number, flat_type, owner_id, resident_ids)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [flatId, flatNumber, floorNumber, flatType, ownerId, residentIds]
        );

        // 1(b). Update the Owner
        await client.query(`UPDATE users SET flat_id = $1 WHERE id = $2`, [flatId, ownerId]);

        // 1(c). Update the Residents
        // Use = ANY($2::uuid[]) to efficiently update multiple users at once
        if (residentIds.length > 0) {
            await client.query(`UPDATE users SET flat_id = $1 WHERE id = ANY($2::uuid[])`, [
                flatId,
                residentIds,
            ]);
        }

        // 1(d). Generate First Bill
        // Fetch rate first from subscription_plans (Mocking 2500 here)
        const amountDue = 2500.00;
        const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed
        const currentYear = new Date().getFullYear();

        await client.query(
            `INSERT INTO billing_records (flat_id, billing_month, billing_year, amount_due, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
            [flatId, currentMonth, currentYear, amountDue]
        );

        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ==========================================
// 2. UPDATE FLAT (Add Resident)
// ==========================================
export const addResidentToFlat = async (flatId: string, newResidentId: string) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Append to array using array_append
        await client.query(
            `UPDATE flats 
       SET resident_ids = array_append(resident_ids, $1), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
            [newResidentId, flatId]
        );

        await client.query(`UPDATE users SET flat_id = $1 WHERE id = $2`, [flatId, newResidentId]);

        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ==========================================
// 3. DELETE FLAT (Soft Deletion)
// ==========================================
export const deleteFlat = async (flatId: string) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Deactivate flat
        await client.query(
            `UPDATE flats SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [flatId]
        );

        // Unassign users
        await client.query(`UPDATE users SET flat_id = NULL WHERE flat_id = $1`, [flatId]);

        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ==========================================
// 4 & 5. MONTHLY RECORD (Dynamic Filter)
// ==========================================
export const getMonthlyRecords = async (month: string | null, year: string | null) => {
    // Parse inputs. If "all", pass null to Postgres.
    const monthParam = month === 'all' || !month ? null : parseInt(month, 10);
    const yearParam = year === 'all' || !year ? null : parseInt(year, 10);

    const query = `
    SELECT 
        users.id AS resident_id,
        users.name AS resident_name,
        users.email AS resident_email,
        users.phone_number AS resident_phone,
        flats.flat_number AS flat_address,
        billing_records.status AS payment_status,
        billing_records.billing_month,
        billing_records.billing_year,
        billing_records.amount_due
    FROM flats
    JOIN users ON users.id = ANY(flats.resident_ids)
    JOIN billing_records ON billing_records.flat_id = flats.id
    WHERE 
        ($1::int IS NULL OR billing_records.billing_month = $1::int)
        AND ($2::int IS NULL OR billing_records.billing_year = $2::int)
        AND flats.is_active = TRUE
        AND users.is_active = TRUE
    ORDER BY 
        billing_records.billing_year DESC,
        billing_records.billing_month DESC;
  `;

    const result = await pool.query(query, [monthParam, yearParam]);
    return result.rows;
};

// ==========================================
// 6. ADMIN POWERS: Mark as Paid
// ==========================================
export const markBillAsPaid = async (
    billId: string,
    adminUserId: string,
    amountPaid: number,
    paymentMode: string
) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Verify it's not already paid
        const checkRes = await client.query(`SELECT status FROM billing_records WHERE id = $1`, [billId]);
        if (checkRes.rows.length === 0) throw new Error("Bill not found.");
        if (checkRes.rows[0].status === 'paid') {
            throw new Error("WARNING: This bill is already marked as paid.");
        }

        // 2. Insert Manual Payment Log
        await client.query(
            `INSERT INTO payments (id, bill_id, user_id, amount_paid, payment_mode, payment_status, remarks)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'success', 'Manually marked as paid by Admin')`,
            [billId, adminUserId, amountPaid, paymentMode]
        );

        // 3. Update Bill Status
        await client.query(
            `UPDATE billing_records SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [billId]
        );

        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
