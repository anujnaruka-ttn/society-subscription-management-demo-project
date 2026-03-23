import { query } from "../config/db";

interface Flat {
    id: string;
    flat_number: string;
    flat_type: string;
}

export const seedBillingRecords = async () => {
    try {
        console.log("Fetching existing flats from database...");
        
        // Get all existing flats
        const flatsResult = await query("SELECT id, flat_number, flat_type FROM flats WHERE is_active = true");
        const flats: Flat[] = flatsResult.rows;
        
        if (flats.length === 0) {
            console.log("No flats found in database. Please seed flats first.");
            process.exit(1);
        }
        
        console.log(`Found ${flats.length} flats to create billing records for`);
        
        let createdCount = 0;
        let skippedCount = 0;
        
        for (const flat of flats) {
            // Check if billing record already exists for current month
            const checkResult = await query(
                `SELECT id FROM billing_records 
                 WHERE flat_id = $1 
                 AND billing_month = EXTRACT(MONTH FROM NOW()) 
                 AND billing_year = EXTRACT(YEAR FROM NOW())`,
                [flat.id]
            );
            
            if (checkResult.rows.length > 0) {
                console.log(`Billing record already exists for flat ${flat.flat_number}, skipping...`);
                skippedCount++;
                continue;
            }
            
            // Get monthly rate for the flat type
            const rateResult = await query(
                `SELECT monthly_rate FROM subscription_plans 
                 WHERE flat_type = $1 
                 AND is_active = true 
                 AND effective_from <= CURRENT_DATE
                 ORDER BY effective_from DESC 
                 LIMIT 1`,
                [flat.flat_type]
            );
            const monthlyRate = rateResult.rows.length > 0 ? rateResult.rows[0].monthly_rate : 0;
            
            // Create billing record with due date 15 days from now
            await query(
                `INSERT INTO billing_records (id, flat_id, billing_month, billing_year, amount_due, status, due_date, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1, EXTRACT(MONTH FROM NOW()), EXTRACT(YEAR FROM NOW()), $2, 'pending', NOW() + INTERVAL '15 days', NOW(), NOW())`,
                [flat.id, monthlyRate]
            );
            
            console.log(`Created billing record for flat ${flat.flat_number} (${flat.flat_type}) - Amount: ₹${monthlyRate}`);
            createdCount++;
        }
        
        console.log(`\nBilling records seeding completed!`);
        console.log(`Created: ${createdCount}, Skipped: ${skippedCount}, Total: ${flats.length}`);
    } catch (error) {
        console.error("Error seeding billing records:", error);
        process.exit(1);
    }
};
