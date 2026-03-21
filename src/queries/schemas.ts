export const CREATE_ENUMS = `
-- 1. Create the ENUM types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'resident');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE flat_type_enum AS ENUM ('1bhk', '2bhk', '3bhk', '4bhk');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_status_enum AS ENUM ('paid', 'pending', 'overdue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_mode_enum AS ENUM ('cash', 'offline', 'upi', 'online_razorpay', 'online_stripe');
EXCEPTION
    WHEN duplicate_object THEN 
        -- Add missing values to existing enum
        BEGIN
            ALTER TYPE payment_mode_enum ADD VALUE 'offline';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('success', 'failed', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type_enum AS ENUM ('payment_reminder', 'announcement', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
`;

export const CREATE_USERS_TABLE = `
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
    flat_id UUID, 
    one_signal_player_id VARCHAR(255), 
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_FLATS_TABLE = `
-- 3. Create the flats table WITH the owner_id referencing users
CREATE TABLE IF NOT EXISTS flats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flat_number VARCHAR(20) NOT NULL, -- UNIQUE removed as per user request
    floor_number INT,
    flat_type flat_type_enum NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL, 
    resident_ids UUID[], 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const ALTER_USERS_FLAT_FK = `
-- 4. Finally, ALTER the users table to add the flat_id constraint
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_flat') THEN
        ALTER TABLE users ADD CONSTRAINT fk_user_flat FOREIGN KEY (flat_id) REFERENCES flats(id) ON DELETE SET NULL;
    END IF;
END $$;
`;

export const CREATE_SUBSCRIPTION_PLANS_TABLE = `
-- 5. Create Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flat_type flat_type_enum NOT NULL,
    monthly_rate DECIMAL(10, 2) NOT NULL,
    effective_from DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_BILLING_RECORDS_TABLE = `
-- 6. Create Billing Records Table
CREATE TABLE IF NOT EXISTS billing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flat_id UUID REFERENCES flats(id) NOT NULL,
    billing_month INT NOT NULL, 
    billing_year INT NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    status billing_status_enum DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flat_id, billing_month, billing_year)
);
`;

export const CREATE_PAYMENTS_TABLE = `
-- 7. Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID REFERENCES billing_records(id), 
    user_id UUID REFERENCES users(id), 
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_mode payment_mode_enum NOT NULL,
    transaction_id VARCHAR(255), 
    payment_status payment_status_enum DEFAULT 'success',
    receipt_url TEXT, 
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_NOTIFICATIONS_TABLE = `
-- 8. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

