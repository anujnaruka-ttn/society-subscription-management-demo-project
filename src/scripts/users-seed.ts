import { query } from "../config/db";
import { hashPassword } from "../utils/password";
import * as fs from "fs";
import * as path from "path";

interface SampleUser {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
}

const seedUsers = async () => {
    try {
        // Read the sample users JSON file
        const jsonPath = path.join(__dirname, "../../docs/sample_users.json");
        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const users: SampleUser[] = JSON.parse(rawData);

        console.log(`Found ${users.length} users to seed...`);

        for (const user of users) {
            // Generate profile image URL using DiceBear
            const profile_image = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`;

            // Hash the password
            const hashedPassword = await hashPassword(user.password);

            // Check if user already exists
            const checkResult = await query("SELECT * FROM users WHERE email = $1", [user.email]);

            if (checkResult.rows.length > 0) {
                console.log(`User ${user.email} already exists. Updating...`);
                await query(
                    "UPDATE users SET name = $1, password = $2, phone_number = $3, role = $4, profile_image = $5, updated_at = NOW() WHERE email = $6",
                    [user.name, hashedPassword, user.phone_number, user.role, profile_image, user.email]
                );
            } else {
                console.log(`Creating user ${user.email}...`);
                await query(
                    "INSERT INTO users (name, email, password, phone_number, role, profile_image, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())",
                    [user.name, user.email, hashedPassword, user.phone_number, user.role, profile_image]
                );
            }
        }

        console.log("Users seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
