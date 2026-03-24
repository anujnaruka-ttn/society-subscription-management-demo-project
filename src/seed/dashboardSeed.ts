import { query } from "../config/db";
// Sample data for dashboard seeding
const samplePayments = [
    // April 2024 payments
    { payment_date: "2024-04-01", amount_paid: 150000, flat_id: 1 },
    { payment_date: "2024-04-02", amount_paid: 180000, flat_id: 2 },
    { payment_date: "2024-04-03", amount_paid: 120000, flat_id: 3 },
    { payment_date: "2024-04-04", amount_paid: 260000, flat_id: 4 },
    { payment_date: "2024-04-05", amount_paid: 290000, flat_id: 5 },
    { payment_date: "2024-04-06", amount_paid: 340000, flat_id: 1 },
    { payment_date: "2024-04-07", amount_paid: 180000, flat_id: 2 },
    { payment_date: "2024-04-08", amount_paid: 320000, flat_id: 3 },
    { payment_date: "2024-04-09", amount_paid: 110000, flat_id: 4 },
    { payment_date: "2024-04-10", amount_paid: 190000, flat_id: 5 },
    { payment_date: "2024-04-11", amount_paid: 350000, flat_id: 1 },
    { payment_date: "2024-04-12", amount_paid: 210000, flat_id: 2 },
    { payment_date: "2024-04-13", amount_paid: 380000, flat_id: 3 },
    { payment_date: "2024-04-14", amount_paid: 220000, flat_id: 4 },
    { payment_date: "2024-04-15", amount_paid: 170000, flat_id: 5 },
    { payment_date: "2024-04-16", amount_paid: 190000, flat_id: 1 },
    { payment_date: "2024-04-17", amount_paid: 360000, flat_id: 2 },
    { payment_date: "2024-04-18", amount_paid: 410000, flat_id: 3 },
    { payment_date: "2024-04-19", amount_paid: 180000, flat_id: 4 },
    { payment_date: "2024-04-20", amount_paid: 150000, flat_id: 5 },
    { payment_date: "2024-04-21", amount_paid: 200000, flat_id: 1 },
    { payment_date: "2024-04-22", amount_paid: 170000, flat_id: 2 },
    { payment_date: "2024-04-23", amount_paid: 230000, flat_id: 3 },
    { payment_date: "2024-04-24", amount_paid: 290000, flat_id: 4 },
    { payment_date: "2024-04-25", amount_paid: 250000, flat_id: 5 },
    { payment_date: "2024-04-26", amount_paid: 130000, flat_id: 1 },
    { payment_date: "2024-04-27", amount_paid: 420000, flat_id: 2 },
    { payment_date: "2024-04-28", amount_paid: 180000, flat_id: 3 },
    { payment_date: "2024-04-29", amount_paid: 240000, flat_id: 4 },
    { payment_date: "2024-04-30", amount_paid: 380000, flat_id: 5 },
    
    // May 2024 payments
    { payment_date: "2024-05-01", amount_paid: 220000, flat_id: 1 },
    { payment_date: "2024-05-02", amount_paid: 310000, flat_id: 2 },
    { payment_date: "2024-05-03", amount_paid: 190000, flat_id: 3 },
    { payment_date: "2024-05-04", amount_paid: 420000, flat_id: 4 },
    { payment_date: "2024-05-05", amount_paid: 390000, flat_id: 5 },
    { payment_date: "2024-05-06", amount_paid: 520000, flat_id: 1 },
    { payment_date: "2024-05-07", amount_paid: 300000, flat_id: 2 },
    { payment_date: "2024-05-08", amount_paid: 210000, flat_id: 3 },
    { payment_date: "2024-05-09", amount_paid: 180000, flat_id: 4 },
    { payment_date: "2024-05-10", amount_paid: 330000, flat_id: 5 },
    { payment_date: "2024-05-11", amount_paid: 270000, flat_id: 1 },
    { payment_date: "2024-05-12", amount_paid: 240000, flat_id: 2 },
    { payment_date: "2024-05-13", amount_paid: 160000, flat_id: 3 },
    { payment_date: "2024-05-14", amount_paid: 490000, flat_id: 4 },
    { payment_date: "2024-05-15", amount_paid: 380000, flat_id: 5 },
    { payment_date: "2024-05-16", amount_paid: 400000, flat_id: 1 },
    { payment_date: "2024-05-17", amount_paid: 420000, flat_id: 2 },
    { payment_date: "2024-05-18", amount_paid: 350000, flat_id: 3 },
    { payment_date: "2024-05-19", amount_paid: 180000, flat_id: 4 },
    { payment_date: "2024-05-20", amount_paid: 230000, flat_id: 5 },
    { payment_date: "2024-05-21", amount_paid: 140000, flat_id: 1 },
    { payment_date: "2024-05-22", amount_paid: 120000, flat_id: 2 },
    { payment_date: "2024-05-23", amount_paid: 290000, flat_id: 3 },
    { payment_date: "2024-05-24", amount_paid: 220000, flat_id: 4 },
    { payment_date: "2024-05-25", amount_paid: 250000, flat_id: 5 },
    { payment_date: "2024-05-26", amount_paid: 170000, flat_id: 1 },
    { payment_date: "2024-05-27", amount_paid: 460000, flat_id: 2 },
    { payment_date: "2024-05-28", amount_paid: 190000, flat_id: 3 },
    { payment_date: "2024-05-29", amount_paid: 130000, flat_id: 4 },
    { payment_date: "2024-05-30", amount_paid: 280000, flat_id: 5 },
    { payment_date: "2024-05-31", amount_paid: 230000, flat_id: 1 },
    
    // June 2024 payments
    { payment_date: "2024-06-01", amount_paid: 200000, flat_id: 2 },
    { payment_date: "2024-06-02", amount_paid: 410000, flat_id: 3 },
    { payment_date: "2024-06-03", amount_paid: 160000, flat_id: 4 },
    { payment_date: "2024-06-04", amount_paid: 380000, flat_id: 5 },
    { payment_date: "2024-06-05", amount_paid: 140000, flat_id: 1 },
    { payment_date: "2024-06-06", amount_paid: 250000, flat_id: 2 },
    { payment_date: "2024-06-07", amount_paid: 370000, flat_id: 3 },
    { payment_date: "2024-06-08", amount_paid: 320000, flat_id: 4 },
    { payment_date: "2024-06-09", amount_paid: 480000, flat_id: 5 },
    { payment_date: "2024-06-10", amount_paid: 200000, flat_id: 1 },
    { payment_date: "2024-06-11", amount_paid: 150000, flat_id: 2 },
    { payment_date: "2024-06-12", amount_paid: 420000, flat_id: 3 },
    { payment_date: "2024-06-13", amount_paid: 130000, flat_id: 4 },
    { payment_date: "2024-06-14", amount_paid: 380000, flat_id: 5 },
    { payment_date: "2024-06-15", amount_paid: 350000, flat_id: 1 },
    { payment_date: "2024-06-16", amount_paid: 310000, flat_id: 2 },
    { payment_date: "2024-06-17", amount_paid: 520000, flat_id: 3 },
    { payment_date: "2024-06-18", amount_paid: 170000, flat_id: 4 },
    { payment_date: "2024-06-19", amount_paid: 290000, flat_id: 5 },
    { payment_date: "2024-06-20", amount_paid: 450000, flat_id: 1 },
    { payment_date: "2024-06-21", amount_paid: 210000, flat_id: 2 },
    { payment_date: "2024-06-22", amount_paid: 270000, flat_id: 3 },
    { payment_date: "2024-06-23", amount_paid: 530000, flat_id: 4 },
    { payment_date: "2024-06-24", amount_paid: 180000, flat_id: 5 },
    { payment_date: "2024-06-25", amount_paid: 190000, flat_id: 1 },
    { payment_date: "2024-06-26", amount_paid: 380000, flat_id: 2 },
    { payment_date: "2024-06-27", amount_paid: 490000, flat_id: 3 },
    { payment_date: "2024-06-28", amount_paid: 200000, flat_id: 4 },
    { payment_date: "2024-06-29", amount_paid: 160000, flat_id: 5 },
    { payment_date: "2024-06-30", amount_paid: 400000, flat_id: 1 },
];

export const seedDashboardData = async () => {
    try {
        console.log("Starting dashboard data seeding...");

        // First, let's check if flats and users exist
        const flatsResult = await query("SELECT id, owner_id FROM flats LIMIT 5");
        const usersResult = await query("SELECT id FROM users LIMIT 5");
        
        if (flatsResult.rows.length === 0) {
            console.log("No flats found. Please seed flats first.");
            return;
        }

        if (usersResult.rows.length === 0) {
            console.log("No users found. Please seed users first.");
            return;
        }

        const availableFlats = flatsResult.rows;
        const availableUsers = usersResult.rows;
        console.log(`Found ${availableFlats.length} flats and ${availableUsers.length} users for seeding`);

        // Clear existing payments and billing records for clean seeding
        await query("DELETE FROM payments WHERE payment_date >= '2024-04-01'");
        await query("DELETE FROM billing_records WHERE billing_month IN (4, 5, 6) AND billing_year = 2024");
        console.log("Cleared existing payments and billing records from April 2024 onwards");

        // Insert sample payments
        let userIndex = 0;
        for (const payment of samplePayments) {
            // Get a random flat ID from available flats
            const flat = availableFlats[payment.flat_id - 1] || availableFlats[0];
            const flatId = flat.id;
            
            // Use different users to avoid unique constraint violations
            const userId = availableUsers[userIndex % availableUsers.length].id;
            userIndex++;

            // Extract billing month and year as integers
            const billingMonth = parseInt(payment.payment_date.substring(5, 7)); // Extract MM from YYYY-MM-DD
            const billingYear = parseInt(payment.payment_date.substring(0, 4)); // Extract YYYY from YYYY-MM-DD

            // Check if billing record already exists, skip if it does
            const existingBilling = await query(
                "SELECT id FROM billing_records WHERE flat_id = $1 AND user_id = $2 AND billing_month = $3 AND billing_year = $4",
                [flatId, userId, billingMonth, billingYear]
            );

            if (existingBilling.rows.length > 0) {
                continue; // Skip this payment if billing record already exists
            }

            // Create billing record first with user_id, billing_month, and billing_year
            const billingResult = await query(
                `INSERT INTO billing_records (flat_id, user_id, billing_month, billing_year, amount_due, due_date, status, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW()) 
                 RETURNING id`,
                [flatId, userId, billingMonth, billingYear, payment.amount_paid, payment.payment_date]
            );

            const billingId = billingResult.rows[0].id;

            // Create payment record
            await query(
                `INSERT INTO payments (bill_id, amount_paid, payment_date, payment_status, payment_mode, created_at, updated_at) 
                 VALUES ($1, $2, $3, 'success', 'online_razorpay', NOW(), NOW())`,
                [billingId, payment.amount_paid, payment.payment_date]
            );
        }

        console.log(`Successfully seeded ${samplePayments.length} payment records`);
        
        // Verify the data
        const verifyResult = await query(`
            SELECT 
                DATE_TRUNC('month', payment_date) as month,
                COUNT(*) as payments,
                SUM(amount_paid) as total_amount
            FROM payments 
            WHERE payment_status = 'success' 
            GROUP BY DATE_TRUNC('month', payment_date)
            ORDER BY month DESC
        `);

        console.log("Verification - Monthly payment summary:");
        verifyResult.rows.forEach(row => {
            console.log(`Month: ${row.month}, Payments: ${row.payments}, Total: ${row.total_amount}`);
        });

        return { success: true, message: "Dashboard data seeded successfully" };
    } catch (error: any) {
        console.error("Error seeding dashboard data:", error);
        return { success: false, error: error.message };
    }
};

// Run this function directly if this file is executed
if (require.main === module) {
    seedDashboardData()
        .then(result => {
            console.log("Seeding result:", result);
            process.exit(0);
        })
        .catch(error => {
            console.error("Seeding failed:", error);
            process.exit(1);
        });
}
