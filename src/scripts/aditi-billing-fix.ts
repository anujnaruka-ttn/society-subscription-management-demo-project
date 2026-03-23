import { query } from "../config/db";

/**
 * Fix Aditi Nair's billing records
 * This script will:
 * 1. Find Aditi Nair's flat
 * 2. Check her current billing records
 * 3. Fix billing amounts based on correct flat type rates
 */

const fixAditiBilling = async () => {
    try {
        console.log("🔍 Looking for Aditi Nair's billing records...");
        
        // Find Aditi Nair
        const userResult = await query(
            "SELECT id, name, email, flat_id FROM users WHERE email = 'aditi.nair73@example.com'"
        );
        
        if (userResult.rowCount === 0) {
            console.log("❌ Aditi Nair not found in database");
            return;
        }
        
        const aditi = userResult.rows[0];
        console.log(`✅ Found Aditi Nair: ${aditi.name} (${aditi.email})`);
        
        if (!aditi.flat_id) {
            console.log("❌ Aditi Nair doesn't have a flat assigned");
            return;
        }
        
        // Get Aditi's flat details
        const flatResult = await query(
            "SELECT id, flat_number, flat_type FROM flats WHERE id = $1",
            [aditi.flat_id]
        );
        
        if (flatResult.rowCount === 0) {
            console.log("❌ Flat not found for Aditi Nair");
            return;
        }
        
        const flat = flatResult.rows[0];
        console.log(`🏠 Aditi's flat: ${flat.flat_number} (${flat.flat_type})`);
        
        // Get correct monthly rate for her flat type (lowercase)
        const rateResult = await query(
            "SELECT monthly_rate FROM subscription_plans WHERE flat_type = $1 AND is_active = true",
            [flat.flat_type.toLowerCase()]
        );
        
        if (rateResult.rowCount === 0) {
            console.log(`❌ No subscription plan found for flat type: ${flat.flat_type}`);
            return;
        }
        
        const correctRate = parseFloat(rateResult.rows[0].monthly_rate);
        console.log(`💰 Correct monthly rate for ${flat.flat_type}: ₹${correctRate}`);
        
        // Get all billing records for Aditi's flat
        const billingResult = await query(
            "SELECT id, billing_month, billing_year, amount_due, status FROM billing_records WHERE flat_id = $1 ORDER BY billing_year, billing_month",
            [flat.id]
        );
        
        if (billingResult.rowCount === 0) {
            console.log("❌ No billing records found for Aditi's flat");
            return;
        }
        
        console.log(`📊 Found ${billingResult.rowCount} billing records for Aditi's flat:`);
        
        let updatedCount = 0;
        
        for (const record of billingResult.rows) {
            const currentAmount = parseFloat(record.amount_due);
            
            console.log(`  📅 ${record.billing_month}/${record.billing_year}: ₹${currentAmount} (${record.status})`);
            
            if (currentAmount !== correctRate && record.status === 'pending') {
                // Update pending records with correct amount
                await query(
                    "UPDATE billing_records SET amount_due = $1, updated_at = NOW() WHERE id = $2",
                    [correctRate, record.id]
                );
                console.log(`  ✅ Updated: ₹${currentAmount} → ₹${correctRate}`);
                updatedCount++;
            } else if (currentAmount !== correctRate && record.status === 'paid') {
                console.log(`  ⚠️  Paid record with wrong amount (₹${currentAmount}) - keeping as is`);
            } else {
                console.log(`  ✅ Already correct amount`);
            }
        }
        
        console.log(`\n🎉 Aditi Nair's billing fix completed!`);
        console.log(`📊 Updated ${updatedCount} billing records`);
        console.log(`💰 All pending records now show correct rate: ₹${correctRate}`);
        
    } catch (error) {
        console.error("💥 Error fixing Aditi Nair's billing:", error);
        process.exit(1);
    }
};

fixAditiBilling();
