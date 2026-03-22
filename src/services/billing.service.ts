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

export {
    findAllBillingRecords,
    findBillingRecordsByMonth,
    updateBillingStatus,
    softDeleteBillingRecord,
    checkPaymentForBill,
    findBillingRecordsByFlatOwner,
    findBillingRecordsByFlatOwnerAndMonth,
    updateBillingRecordByFlatId
};
