import { query } from "../config/db";
import { GET_BILLING_RECORDS_BY_FLAT, GET_BILLING_RECORDS_BY_FLAT_AND_MONTH } from "../queries/billing.queries";

const seedJayaThakurBilling = async () => {
    try {
        console.log("Finding Jaya Thakur's user record...");
        
        // Find Jaya Thakur's user ID
        const userResult = await query(
            "SELECT id, name, email FROM users WHERE email = 'jaya.thakur77@example.com'"
        );
        
        if (userResult.rows.length === 0) {
            console.log("Jaya Thakur not found in database. Please seed users first.");
            process.exit(1);
        }
        
        const jaya = userResult.rows[0];
        console.log(`Found Jaya Thakur: ${jaya.name} (${jaya.email}) - ID: ${jaya.id}`);
        
        // Check if Jaya has a flat assigned
        let flatResult = await query(
            "SELECT f.id, f.flat_number, f.floor_number, f.flat_type FROM flats f WHERE f.owner_id = $1 OR $1 = ANY(f.resident_ids)",
            [jaya.id]
        );
        
        if (flatResult.rowCount === 0) {
            console.log("Jaya Thakur is not associated with any flat. Assigning to a flat...");
            
            // Find an available 2BHK flat (assigning to 201 as example)
            const availableFlatResult = await query(
                "SELECT id, flat_number, floor_number, flat_type FROM flats WHERE flat_number = '201' AND is_active = true"
            );
            
            if (availableFlatResult.rowCount === 0) {
                console.log("No available flats found. Please seed flats first.");
                process.exit(1);
            }
            
            const flat = availableFlatResult.rows[0];
            
            // Assign Jaya as owner of the flat
            await query(
                "UPDATE flats SET owner_id = $1, resident_ids = ARRAY[$1::uuid] WHERE id = $2",
                [jaya.id, flat.id]
            );
            
            console.log(`Assigned Jaya Thakur to flat ${flat.flat_number} (Floor ${flat.floor_number})`);
            // Re-query to get the updated flat result
            const requeryResult = await query(
                "SELECT id, flat_number, floor_number, flat_type FROM flats WHERE id = $1",
                [flat.id]
            );
            flatResult = requeryResult;
        }
        
        const flat = flatResult.rows[0];
        console.log(`Using flat: ${flat.flat_number} (Floor ${flat.floor_number}, Type: ${flat.flat_type})`);
        
        // Get monthly rate for this flat type
        const rateResult = await query(
            "SELECT monthly_rate FROM subscription_plans WHERE flat_type = $1 AND is_active = true ORDER BY effective_from DESC LIMIT 1",
            [flat.flat_type]
        );
        
        if (rateResult.rowCount === 0) {
            console.log(`No subscription plan found for flat type: ${flat.flat_type}`);
            process.exit(1);
        }
        
        const monthlyRate = rateResult.rows[0].monthly_rate;
        console.log(`Monthly rate for ${flat.flat_type}: ₹${monthlyRate}`);
        
        // Create billing records for the last 3 months
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        const monthsToCreate = [
            { month: currentMonth - 2, year: currentMonth - 2 >= 1 ? currentYear : currentYear - 1 },
            { month: currentMonth - 1, year: currentMonth - 1 >= 1 ? currentYear : currentYear - 1 },
            { month: currentMonth, year: currentYear }
        ];
        
        let createdCount = 0;
        let skippedCount = 0;
        
        for (const { month, year } of monthsToCreate) {
            if (month < 1) {
                continue; // Skip invalid months
            }
            
            // Check if billing record already exists
            const checkResult = await query(
                "SELECT id FROM billing_records WHERE flat_id = $1 AND billing_month = $2 AND billing_year = $3",
                [flat.id, month, year]
            );
            
            if (checkResult.rowCount && checkResult.rowCount > 0) {
                console.log(`Billing record already exists for ${year}-${month.toString().padStart(2, '0')}, skipping...`);
                skippedCount++;
                continue;
            }
            
            // Create billing record
            await query(
                `INSERT INTO billing_records (id, flat_id, billing_month, billing_year, amount_due, status, due_date, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW() + INTERVAL '30 days', NOW(), NOW())`,
                [flat.id, month, year, monthlyRate, month === currentMonth ? 'pending' : 'paid']
            );
            
            console.log(`Created billing record for ${year}-${month.toString().padStart(2, '0')} - Amount: ₹${monthlyRate} - Status: ${month === currentMonth ? 'pending' : 'paid'}`);
            createdCount++;
        }
        
        // Test the queries
        console.log("\nTesting GET_BILLING_RECORDS_BY_FLAT query...");
        const testResult1 = await query(GET_BILLING_RECORDS_BY_FLAT, [jaya.id]);
        console.log(`Found ${testResult1.rows.length} billing records for Jaya Thakur`);
        
        console.log("\nTesting GET_BILLING_RECORDS_BY_FLAT_AND_MONTH query...");
        const testResult2 = await query(GET_BILLING_RECORDS_BY_FLAT_AND_MONTH, [jaya.id, currentYear, currentMonth]);
        console.log(`Found ${testResult2.rows.length} billing records for Jaya Thakur in ${currentYear}-${currentMonth.toString().padStart(2, '0')}`);
        
        console.log(`\nJaya Thakur billing seeding completed!`);
        console.log(`Created: ${createdCount}, Skipped: ${skippedCount}`);
        process.exit(0);
        
    } catch (error) {
        console.error("Error seeding Jaya Thakur billing records:", error);
        process.exit(1);
    }
};

seedJayaThakurBilling();
