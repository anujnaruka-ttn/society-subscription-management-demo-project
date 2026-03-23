import { query } from "../config/db";

const fixJayaBillingAmount = async () => {
    try {
        console.log("Finding Jaya Thakur's billing records with zero amount...");
        
        // Find Jaya's user ID
        const userResult = await query(
            "SELECT id, name, email FROM users WHERE email = 'jaya.thakur77@example.com'"
        );
        
        if (userResult.rowCount === 0) {
            console.log("Jaya Thakur not found in database.");
            process.exit(1);
        }
        
        const jaya = userResult.rows[0];
        console.log(`Found Jaya Thakur: ${jaya.name} (${jaya.email}) - ID: ${jaya.id}`);
        
        // Find her flat
        const flatResult = await query(
            "SELECT f.id, f.flat_number, f.floor_number, f.flat_type FROM flats f WHERE f.owner_id = $1 OR $1 = ANY(f.resident_ids)",
            [jaya.id]
        );
        
        if (flatResult.rowCount === 0) {
            console.log("Jaya Thakur is not associated with any flat.");
            process.exit(1);
        }
        
        const flat = flatResult.rows[0];
        console.log(`Using flat: ${flat.flat_number} (Floor ${flat.floor_number}, Type: ${flat.flat_type})`);
        
        // Get the correct monthly rate for this flat type
        const rateResult = await query(
            "SELECT monthly_rate FROM subscription_plans WHERE flat_type = $1 AND is_active = true ORDER BY effective_from DESC LIMIT 1",
            [flat.flat_type]
        );
        
        if (rateResult.rowCount === 0) {
            console.log(`No subscription plan found for flat type: ${flat.flat_type}`);
            process.exit(1);
        }
        
        const monthlyRate = rateResult.rows[0].monthly_rate;
        console.log(`Correct monthly rate for ${flat.flat_type}: ₹${monthlyRate}`);
        
        // Find billing records with zero amount for Jaya's flat
        const zeroAmountResult = await query(
            "SELECT id, billing_month, billing_year, amount_due, status FROM billing_records WHERE flat_id = $1 AND amount_due = 0",
            [flat.id]
        );
        
        if (zeroAmountResult.rowCount === 0) {
            console.log("No billing records with zero amount found for Jaya's flat.");
            process.exit(0);
        }
        
        console.log(`Found ${zeroAmountResult.rowCount} billing records with zero amount to fix:`);
        
        let updatedCount = 0;
        
        for (const record of zeroAmountResult.rows) {
            console.log(`Updating record ${record.id} for ${record.billing_year}-${record.billing_month.toString().padStart(2, '0')}: ₹${record.amount_due} → ₹${monthlyRate}`);
            
            await query(
                "UPDATE billing_records SET amount_due = $1, updated_at = NOW() WHERE id = $2",
                [monthlyRate, record.id]
            );
            
            updatedCount++;
        }
        
        console.log(`\nJaya Thakur billing amount fix completed!`);
        console.log(`Updated: ${updatedCount} records`);
        
        // Test the queries again after fix
        console.log("\nTesting GET_BILLING_RECORDS_BY_FLAT query after fix...");
        const testResult1 = await query(
            `SELECT
                br.id,
                br.billing_month,
                br.billing_year,
                br.amount_due,
                br.status,
                br.due_date,
                br.flat_id,
                f.flat_number,
                f.floor_number,
                f.flat_type,
                (
                    SELECT json_agg(json_build_object(
                        'id', ru.id,
                        'name', ru.name,
                        'email', ru.email,
                        'profile_image', ru.profile_image
                    ))
                    FROM users ru
                    WHERE ru.id = ANY(f.resident_ids)
                ) as residents,
                CONCAT('Flat ', f.flat_number, ', Floor ', f.floor_number) as flat_address,
                p.payment_mode,
                p.amount_paid,
                p.payment_status,
                p.transaction_id,
                p.payment_date
            FROM billing_records br
            LEFT JOIN flats f ON br.flat_id = f.id
            LEFT JOIN payments p ON p.bill_id = br.id AND p.payment_status = 'success'
            WHERE f.owner_id = $1
            ORDER BY br.billing_year DESC, br.billing_month DESC`,
            [jaya.id]
        );
        console.log(`Found ${testResult1.rowCount} billing records for Jaya Thakur after fix`);
        
        // Show the corrected records
        for (const record of testResult1.rows) {
            console.log(`  - ${record.billing_year}-${record.billing_month.toString().padStart(2, '0')}: ₹${record.amount_due} (${record.status})`);
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error("Error fixing Jaya Thakur billing amounts:", error);
        process.exit(1);
    }
};

fixJayaBillingAmount();
