export interface PaymentEntryData {
    bill_id: string;
    amount_due: number;
    bill_status: string;
    billing_month: number;
    billing_year: number;
    flat_id: string;
    flat_number: string;
    floor_number: number;
    flat_type: string;
    owner_id: string;
    owner_name: string;
    owner_email: string;
    owner_phone: string;
    flat_address: string;
    payment_id: string | null;
    payment_mode: string | null;
    amount_paid: number | null;
    payment_date: string | null;
    payment_status: string | null;
    transaction_id: string | null;
    residents: {
        id: string;
        name: string;
        profile_image: string | null;
        email: string;
    }[] | null;
}
