import { query } from "../config/db";
import { migrate } from "../controllers/Schema";
import { seedAdmin } from "./admin-seed";
import { seedBillingRecords } from "./billing-seed";
import { seedFlats } from "./flats-seed";
import { seedPayments } from "./payments-seed";
import { seedSubscriptions } from "./subscription-seed";
import { seedUsers } from "./users-seed";

/**
 * Complete Database Reset Script
 * 
 * This script will:
 * 1. Drop all existing tables
 * 2. Drop all enum types
 * 3. Run all seeding scripts in proper order
 * 
 * Note: Migration will be handled by server startup
 */

const dropAllTables = async () => {
    console.log("Dropping all existing tables...");
    
    const tables = [
        'payments',
        'billing_records', 
        'subscription_plans',
        'flats',
        'users',
        'notifications'
    ];
    
    for (const table of tables) {
        try {
            await query(`DROP TABLE IF EXISTS ${table} CASCADE`);
            console.log(`Dropped table: ${table}`);
        } catch (error) {
            console.log(`Table ${table} doesn't exist or already dropped`);
        }
    }
};

const dropAllEnums = async () => {
    console.log("Dropping all enum types...");
    
    const enums = [
        'payment_status_enum',
        'payment_mode_enum', 
        'billing_status_enum',
        'flat_type_enum',
        'user_role',
        'notification_type_enum'
    ];
    
    for (const enumType of enums) {
        try {
            await query(`DROP TYPE IF EXISTS ${enumType} CASCADE`);
            console.log(`Dropped enum: ${enumType}`);
        } catch (error) {
            console.log(`Enum ${enumType} doesn't exist or already dropped`);
        }
    }
};

const runSeeding = async () => {
    console.log("Running all seeding scripts...");
    
    try {
        // Run database migration on startup
        console.log("Running database migration...");
        await migrate();
        
        // Run seeding in proper order using top-level imports
        console.log("Step 1: Seeding admin users...");
        await seedAdmin();
        
        console.log("Step 2: Seeding regular users...");
        await seedUsers();
        
        console.log("Step 3: Seeding subscription plans...");
        await seedSubscriptions();
        
        console.log("Step 4: Seeding flats...");
        await seedFlats();
        
        console.log("Step 5: Seeding billing records...");
        await seedBillingRecords();
        
        console.log("Step 6: Seeding payment records...");
        await seedPayments();
        
        console.log("All seeding scripts completed successfully");
        
    } catch (error) {
        console.error("Seeding failed:", error);
        throw error;
    }
};

const resetDatabase = async () => {
    console.log("Starting complete database reset...\n");
    
    try {
        // Step 1: Drop all existing data
        await dropAllTables();
        await dropAllEnums();
        
        // Step 2: Seed fresh data (migration will be handled by server startup)
        await runSeeding();
        
        console.log("\nDatabase reset completed successfully!");
        console.log("Database is now fresh with consistent lowercase enums");
        console.log("Start the server to run migration and create tables");

        process.exit(0);
        
    } catch (error) {
        console.error("\nDatabase reset failed:", error);
        process.exit(1);
    }
};

// Run the reset
resetDatabase();
