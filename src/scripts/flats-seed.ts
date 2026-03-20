import { query } from "../config/db";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface FlatConfig {
    flat_number: string;
    floor_number: number;
    flat_type: string;
}

const generateFlatsConfig = (): FlatConfig[] => {
    const flatTypes = ["1BHK", "2BHK", "3BHK", "4BHK"];
    const flats: FlatConfig[] = [];
    
    // Generate flats for floors 1-10
    for (let floor = 1; floor <= 10; floor++) {
        // 4 flats per floor
        for (let unit = 1; unit <= 4; unit++) {
            const flatNumber = `${floor}${unit.toString().padStart(2, '0')}`; // e.g., 101, 102, 103, 104
            const flatType = flatTypes[unit - 1]; // Rotate through 1BHK, 2BHK, 3BHK, 4BHK
            flats.push({
                flat_number: flatNumber,
                floor_number: floor,
                flat_type: flatType,
            });
        }
    }
    
    return flats;
};

const seedFlats = async () => {
    try {
        console.log("Fetching residents from database...");
        
        // Get all residents from the database
        const residentsResult = await query(
            "SELECT id, name, email, role FROM users WHERE role = 'resident' ORDER BY id"
        );
        
        const residents: User[] = residentsResult.rows;
        
        if (residents.length === 0) {
            console.log("No residents found in database. Please seed users first.");
            process.exit(1);
        }
        
        console.log(`Found ${residents.length} residents`);
        
        // Generate flat configurations
        const flatsConfig = generateFlatsConfig();
        console.log(`Generated ${flatsConfig.length} flats to create`);
        
        let residentIndex = 0;
        
        for (const flatConfig of flatsConfig) {
            // Check if flat already exists
            const checkResult = await query(
                "SELECT id FROM flats WHERE flat_number = $1",
                [flatConfig.flat_number]
            );
            
            if (checkResult.rows.length > 0) {
                console.log(`Flat ${flatConfig.flat_number} already exists, skipping...`);
                continue;
            }
            
            // Assign owner (next available resident)
            const owner = residents[residentIndex % residents.length];
            
            // Assign 0-2 additional residents as flatmates
            const additionalResidents: string[] = [];
            const numFlatmates = Math.floor(Math.random() * 3); // 0, 1, or 2 flatmates
            
            for (let i = 0; i < numFlatmates; i++) {
                const flatmateIndex = (residentIndex + i + 1) % residents.length;
                const flatmate = residents[flatmateIndex];
                if (flatmate.id !== owner.id && !additionalResidents.includes(flatmate.id)) {
                    additionalResidents.push(flatmate.id);
                }
            }
            
            // Insert the flat
            const flatResult = await query(
                `INSERT INTO flats (id, flat_number, floor_number, flat_type, owner_id, resident_ids, is_active, created_at, updated_at) 
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, NOW(), NOW()) 
                 RETURNING *`,
                [
                    flatConfig.flat_number,
                    flatConfig.floor_number,
                    flatConfig.flat_type,
                    owner.id,
                    additionalResidents
                ]
            );
            
            const newFlat = flatResult.rows[0];
            
            // Update all residents' flat_id
            const userIdsToUpdate = [owner.id, ...additionalResidents];
            await query(
                "UPDATE users SET flat_id = $1, updated_at = NOW() WHERE id = ANY($2)",
                [newFlat.id, userIdsToUpdate]
            );
            
            // Get monthly rate for billing
            const rateResult = await query(
                `SELECT monthly_rate FROM subscription_plans 
                 WHERE flat_type = $1 AND is_active = true AND effective_from <= CURRENT_DATE
                 ORDER BY effective_from DESC LIMIT 1`,
                [flatConfig.flat_type]
            );
            const monthlyRate = rateResult.rows.length > 0 ? rateResult.rows[0].monthly_rate : 0;
            
            // Create billing record
            await query(
                `INSERT INTO billing_records (id, flat_id, billing_month, billing_year, amount_due, status, due_date, created_at, updated_at)
                 VALUES (gen_random_uuid(), $1, EXTRACT(MONTH FROM NOW()), EXTRACT(YEAR FROM NOW()), $2, 'pending', NOW() + INTERVAL '15 days', NOW(), NOW())`,
                [newFlat.id, monthlyRate]
            );
            
            console.log(`Created flat ${flatConfig.flat_number} (${flatConfig.flat_type}) - Owner: ${owner.name}, Residents: ${additionalResidents.length}`);
            
            residentIndex++;
        }
        
        console.log("Flats seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding flats:", error);
        process.exit(1);
    }
};

seedFlats();
