import { query } from "../config/db";

const seedPayments = async () => {
    try {
        console.log("Starting payment seeding...");

        // 1. Get all billing records that don't have a payment yet
        const billsResult = await query(
            "SELECT id, amount_due FROM billing_records WHERE status = 'pending' LIMIT 15"
        );
        const bills = billsResult.rows;

        if (bills.length === 0) {
            console.log("No pending bills found. Seed billing records first.");
            process.exit(0);
        }

        // 2. Get some residents to attribute payments to
        const residentsResult = await query(
            "SELECT id FROM users WHERE role = 'resident' LIMIT 10"
        );
        const residents = residentsResult.rows;

        const paymentModes = ['cash', 'upi', 'online_razorpay', 'online_stripe'];
        
        for (let i = 0; i < bills.length; i++) {
            const bill = bills[i];
            const resident = residents[i % residents.length];
            const mode = paymentModes[i % paymentModes.length];

            // Only seed payments for 80% of these bills to leave some empty
            if (Math.random() > 0.8) continue;

            console.log(`Seeding payment for bill ${bill.id} with mode ${mode}`);

            // Create payment
            await query(
                `INSERT INTO payments (id, bill_id, user_id, amount_paid, payment_mode, payment_status, transaction_id, payment_date, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, 'success', $5, NOW(), NOW(), NOW())`,
                [
                    bill.id,
                    resident.id,
                    bill.amount_due,
                    mode,
                    mode === 'cash' ? null : `TRANS_${Math.random().toString(36).substring(7).toUpperCase()}`
                ]
            );

            // Update billing status to paid
            await query(
                "UPDATE billing_records SET status = 'paid' WHERE id = $1",
                [bill.id]
            );
        }

        console.log("Payment seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding payments:", error);
        process.exit(1);
    }
};

seedPayments();
