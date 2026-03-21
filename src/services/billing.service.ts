import { query } from "../config/db";
import { IBilling } from "../models/IBilling";
import { 
    GET_ALL_BILLING_RECORDS, 
    GET_BILLING_RECORDS_BY_MONTH, 
    UPDATE_BILLING_STATUS, 
    SOFT_DELETE_BILLING_RECORD,
    CHECK_PAYMENT_EXISTS,
    GET_BILLING_RECORDS_BY_FLAT
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

export {
    findAllBillingRecords,
    findBillingRecordsByMonth,
    updateBillingStatus,
    softDeleteBillingRecord,
    checkPaymentForBill,
    findBillingRecordsByFlatOwner
};
