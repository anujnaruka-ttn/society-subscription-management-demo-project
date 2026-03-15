-- 1. Create the ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'resident');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE flat_type_enum AS ENUM ('1BHK', '2BHK', '3BHK', '4BHK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create the users table WITHOUT the flat_id foreign key first
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth0_id VARCHAR(255) UNIQUE, 
    password VARCHAR(255), 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_image TEXT,
    phone_number VARCHAR(20),
    role user_role DEFAULT 'resident',
    flat_id UUID, -- Look here! No "REFERENCES flats(id)" yet
    onesignal_player_id VARCHAR(255), 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create the flats table WITH the owner_id referencing users
CREATE TABLE IF NOT EXISTS flats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flat_number VARCHAR(20) UNIQUE NOT NULL,
    floor_number INT,
    flat_type flat_type_enum NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL, -- References users!
    resident_ids UUID[], 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Finally, ALTER the users table to add the flat_id constraint
ALTER TABLE users 
ADD CONSTRAINT fk_user_flat 
FOREIGN KEY (flat_id) 
REFERENCES flats(id) ON DELETE SET NULL;
