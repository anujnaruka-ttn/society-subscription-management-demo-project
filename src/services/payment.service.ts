import { query } from "../config/db";
import { GET_PAYMENT_ENTRIES, RECORD_PAYMENT, UPDATE_BILL_PAID, GET_PENDING_PAYMENTS } from "../queries/payment.queries";

const getPaymentEntries = async () => {
    const result = await query(GET_PAYMENT_ENTRIES);
    return result.rows;
};

const recordPayment = async (data: {
    bill_id: string;
    user_id: string;
    amount_paid: number;
    payment_mode: string;
    transaction_id?: string;
}) => {
    // We should ideally use a transaction here, but for now we do sequential queries
    const paymentResult = await query(RECORD_PAYMENT, [
        data.bill_id,
        data.user_id,
        data.amount_paid,
        data.payment_mode,
        data.transaction_id || null
    ]);

    await query(UPDATE_BILL_PAID, [data.bill_id]);

    return paymentResult.rows[0];
};

const getPendingPayments = async () => {
    const result = await query(GET_PENDING_PAYMENTS);
    return result.rows;
};

export {
    getPaymentEntries,
    recordPayment,
    getPendingPayments
};
