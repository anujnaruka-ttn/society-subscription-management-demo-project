import { query } from "../config/db";
import { hashPassword } from "../utils/password";

export const seedAdmin = async () => {
    try {
        const name = "Anuj Naruka";
        const email = "anuj.admin@example.com";
        const password = "AdminPassword123!";
        const phone_number = "+919876000000";
        const profile_image = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
        const role = "admin";

        console.log(`Hashing password for ${email}...`);
        const hashedPassword = await hashPassword(password);

        console.log(`Checking if admin exists...`);
        const checkResult = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkResult.rows.length > 0) {
            console.log("Admin user already exists. Updating password and details...");
            await query(
                "UPDATE users SET name = $1, password = $2, phone_number = $3, role = $4, profile_image = $5 WHERE email = $6",
                [name, hashedPassword, phone_number, role, profile_image, email]
            );
        } else {
            console.log("Creating new admin user...");
            await query(
                "INSERT INTO users (name, email, password, phone_number, role, profile_image) VALUES ($1, $2, $3, $4, $5, $6)",
                [name, email, hashedPassword, phone_number, role, profile_image]
            );
        }

        console.log("Admin seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding admin user:", error);
        process.exit(1);
    }
};

