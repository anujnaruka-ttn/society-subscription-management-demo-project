-- Create the ENUM type for flat types if it doesn't already exist
DO $$ BEGIN
    CREATE TYPE flat_type_enum AS ENUM ('1BHK', '2BHK', '3BHK', '4BHK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the flats table
CREATE TABLE IF NOT EXISTS flats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flat_number VARCHAR(20) UNIQUE NOT NULL,
    floor_number INT,
    flat_type flat_type_enum NOT NULL,
    owner_id UUID REFERENCES users(id), -- The person accountable for bills
    resident_ids UUID[], -- Array of user IDs living in the flat
    is_active BOOLEAN DEFAULT TRUE, -- Support for soft deletion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
