import { query } from "../config/db";

export const seedSubscriptions = async () => {
    try {
        const plans = [
            { flat_type: '1bhk', monthly_rate: 10000.00 },
            { flat_type: '2bhk', monthly_rate: 20000.00 },
            { flat_type: '3bhk', monthly_rate: 60000.00 },
            { flat_type: '4bhk', monthly_rate: 80000.00 }
        ];

        console.log("Starting subscription plans seeding...");

        for (const plan of plans) {
            // Check if a plan for this flat type already exists
            const checkResult = await query(
                "SELECT id FROM subscription_plans WHERE flat_type = $1 AND is_active = TRUE",
                [plan.flat_type]
            );

            if (checkResult.rows.length > 0) {
                console.log(`Active plan for ${plan.flat_type} already exists. Updating rate to ${plan.monthly_rate}...`);
                await query(
                    "UPDATE subscription_plans SET monthly_rate = $1, effective_from = CURRENT_DATE WHERE flat_type = $2 AND is_active = TRUE",
                    [plan.monthly_rate, plan.flat_type]
                );
            } else {
                console.log(`Creating new active plan for ${plan.flat_type} with rate ${plan.monthly_rate}...`);
                await query(
                    "INSERT INTO subscription_plans (flat_type, monthly_rate, effective_from, is_active) VALUES ($1, $2, CURRENT_DATE, TRUE)",
                    [plan.flat_type, plan.monthly_rate]
                );
            }
        }

        console.log("Subscription plans seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding subscription plans:", error);
        process.exit(1);
    }
};
