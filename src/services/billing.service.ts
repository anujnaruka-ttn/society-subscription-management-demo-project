import { query } from "../config/db";
import { IBilling } from "../models/IBilling";
import { 
    GET_ALL_BILLING_RECORDS, 
    GET_BILLING_RECORDS_BY_MONTH, 
    UPDATE_BILLING_STATUS, 
    SOFT_DELETE_BILLING_RECORD,
    CHECK_PAYMENT_EXISTS,
    GET_BILLING_RECORDS_BY_FLAT,
    GET_BILLING_RECORDS_BY_FLAT_AND_MONTH
} from "../queries/billing.queries";

const findAllBillingRecords = async () => {
    const result = await query(GET_ALL_BILLING_RECORDS);
    return result.rows;
}

const findBillingRecordsByMonth = async (month: number, year: number) => {
    const result = await query(GET_BILLING_RECORDS_BY_MONTH, [month, year]);
    return result.rows;
}

const updateBillingStatus = async (billingId: string, status: string): Promise<IBilling> => {
    try {
        const result = await query(UPDATE_BILLING_STATUS, [status, billingId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const softDeleteBillingRecord = async (billingId: string): Promise<IBilling> => {
    try {
        const result = await query(SOFT_DELETE_BILLING_RECORD, [billingId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const checkPaymentForBill = async (billId: string) => {
    const result = await query(CHECK_PAYMENT_EXISTS, [billId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

const findBillingRecordsByFlatOwner = async (ownerId: string) => {
    const result = await query(GET_BILLING_RECORDS_BY_FLAT, [ownerId]);
    return result.rows;
}

const findBillingRecordsByFlatOwnerAndMonth = async (ownerId: string, month: number, year: number) => {
    const result = await query(GET_BILLING_RECORDS_BY_FLAT_AND_MONTH, [ownerId, year, month]);
    return result.rows;
}

const updateBillingRecordByFlatId = async (flatId: string, updateData: {
    paymentId: string;
    paymentMode: string;
    amountPaid?: number;
    month?: number;
    year?: number;
}) => {
    // Build the WHERE clause with month/year if provided
    let whereClause = 'WHERE flat_id = $1';
    const queryParams = [flatId];
    let paramIndex = 2;

    if (updateData.month && updateData.year) {
        whereClause += ` AND billing_month = $${paramIndex++} AND billing_year = $${paramIndex++}`;
        queryParams.push(updateData.month.toString(), updateData.year.toString());
    }

    // Get the billing record for this flat (and specific month/year if provided)
    const billingQuery = `
        SELECT id, amount_due 
        FROM billing_records 
        ${whereClause}
        ORDER BY billing_year DESC, billing_month DESC 
        LIMIT 1
    `;
    
    const billingResult = await query(billingQuery, queryParams);
    const billingRecord = billingResult.rows[0];
    
    if (!billingRecord) {
        throw new Error("No billing record found for this flat and month/year");
    }

    // Create a payment record
    const paymentQuery = `
        INSERT INTO payments (
            bill_id, 
            user_id, 
            amount_paid, 
            payment_mode, 
            transaction_id, 
            payment_status, 
            payment_date
        )
        VALUES (
            $1, 
            (SELECT owner_id FROM flats WHERE id = $2), 
            $3, 
            $4, 
            $5, 
            'success', 
            CURRENT_TIMESTAMP
        )
        RETURNING *
    `;

    const paymentResult = await query(paymentQuery, [
        billingRecord.id,
        flatId,
        updateData.amountPaid || billingRecord.amount_due,
        updateData.paymentMode,
        updateData.paymentId
    ]);

    // Update billing record status to paid
    const updateBillingQuery = `
        UPDATE billing_records 
        SET status = 'paid'
        WHERE id = $1
        RETURNING *
    `;

    const updatedBillingResult = await query(updateBillingQuery, [billingRecord.id]);

    return {
        payment: paymentResult.rows[0],
        billing: updatedBillingResult.rows[0]
    };
}

const getMonthlyBilling = async () => {
    try {
        console.log('Starting monthly billing generation:', new Date().toLocaleString());
        
        // Get current date
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Convert to 1-12 format
        const currentYear = currentDate.getFullYear();
        
        console.log(`Generating billing for month: ${currentMonth}/${currentYear}`);
        
        // Get all active flats
        const flatsResult = await query(
            `SELECT id, flat_number, floor_number, flat_type 
             FROM flats 
             WHERE is_active = true`
        );
        
        if (flatsResult.rowCount === 0) {
            console.log('No active flats found');
            return;
        }
        
        const flats = flatsResult.rows;
        console.log(`Found ${flats.length} active flats`);
        
        let createdCount = 0;
        let skippedCount = 0;
        
        // Generate billing for each flat
        for (const flat of flats) {
            try {
                // Check if billing record already exists
                const existingResult = await query(
                    `SELECT id FROM billing_records 
                         WHERE flat_id = $1 
                         AND billing_month = $2 
                         AND billing_year = $3`,
                    [flat.id, currentMonth, currentYear]
                );
                
                if (existingResult.rowCount && existingResult.rowCount > 0) {
                    console.log(`Skipping ${flat.flat_number} - billing already exists`);
                    skippedCount++;
                    continue;
                }
                
                // Get monthly rate
                const rateResult = await query(
                    `SELECT monthly_rate FROM subscription_plans 
                         WHERE flat_type = $1 
                         AND is_active = true 
                         ORDER BY effective_from DESC 
                         LIMIT 1`,
                    [flat.flat_type]
                );
                
                const monthlyRate = rateResult.rows.length > 0 ? 
                    parseFloat(rateResult.rows[0].monthly_rate) : 0;
                
                // Create billing record
                await query(
                    `INSERT INTO billing_records (id, flat_id, billing_month, billing_year, amount_due, status, due_date, created_at, updated_at)
                         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'pending', NOW() + INTERVAL '30 days', NOW(), NOW())`,
                    [flat.id, currentMonth, currentYear, monthlyRate]
                );
                
                console.log(`Created billing for ${flat.flat_number} (${flat.flat_type}): ${monthlyRate}`);
                createdCount++;
                
            } catch (error) {
                console.error(`Error creating billing for ${flat.flat.number}:`, error);
            }
        }
        
        console.log(`Monthly billing completed!`);
        console.log(`Summary: ${createdCount} created, ${skippedCount} skipped`);
        
    } catch (error) {
        console.error('Monthly billing generation failed:', error);
    }
}

export {
    findAllBillingRecords,
    findBillingRecordsByMonth,
    updateBillingStatus,
    softDeleteBillingRecord,
    checkPaymentForBill,
    findBillingRecordsByFlatOwner,
    findBillingRecordsByFlatOwnerAndMonth,
    updateBillingRecordByFlatId,
    getMonthlyBilling
};
