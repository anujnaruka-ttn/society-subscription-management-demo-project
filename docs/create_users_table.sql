-- Create the ENUM type for user roles if it doesn't already exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'resident');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth0_id VARCHAR(255) UNIQUE, -- Support for Auth0 / Google Sign In
    password VARCHAR(255), -- Support for Normal Email/Password Login
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_image TEXT, -- URL or path to user's profile picture
    phone_number VARCHAR(20),
    role user_role DEFAULT 'resident',
    flat_id UUID REFERENCES flats(id), -- Nullable for admins
    onesignal_player_id VARCHAR(255), -- Support for OneSignal push notifications
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
