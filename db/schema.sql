-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Districts
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ranges (Forest Stations)
CREATE TABLE IF NOT EXISTS ranges (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role_id INTEGER REFERENCES roles(id),
    range_id INTEGER REFERENCES ranges(id),
    invite_token VARCHAR(255),
    invite_token_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    first_login BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parrot Species
CREATE TABLE IF NOT EXISTS parrot_species (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    common_name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applicants
CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    eri_applicant_id VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    district_id INTEGER REFERENCES districts(id),
    contact_number VARCHAR(20),
    contact_number_whatsapp BOOLEAN DEFAULT false,
    contact_number_secondary VARCHAR(20),
    contact_number_secondary_whatsapp BOOLEAN DEFAULT false,
    email VARCHAR(255),
    occupation VARCHAR(100),
    company VARCHAR(100),
    government_id_type VARCHAR(50),
    government_id_number VARCHAR(100),
    applicant_status VARCHAR(50),
    info_source VARCHAR(100),
    parrot_diet TEXT,
    enclosure_type VARCHAR(100),
    cage_location VARCHAR(100),
    cage_size_feet VARCHAR(50),
    shared_separate VARCHAR(50),
    does_fly_free BOOLEAN DEFAULT false,
    fly_free_when VARCHAR(100),
    are_wings_cut BOOLEAN DEFAULT false,
    applicant_comments TEXT,
    ownership_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    eri_application_id VARCHAR(50),
    applicant_id INTEGER REFERENCES applicants(id),
    range_id INTEGER REFERENCES ranges(id),
    info_source VARCHAR(100),
    application_status VARCHAR(50),
    application_date DATE,
    date_received DATE,
    reference_number VARCHAR(100),
    application_signed BOOLEAN DEFAULT false,
    followup_done BOOLEAN DEFAULT false,
    followup_details TEXT,
    applied_previously BOOLEAN DEFAULT false,
    applied_previously_date DATE,
    previously_approved BOOLEAN DEFAULT false,
    application_experience TEXT,
    application_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permits
CREATE TABLE IF NOT EXISTS permits (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    applicant_id INTEGER REFERENCES applicants(id),
    range_id INTEGER REFERENCES ranges(id),
    application_id INTEGER REFERENCES applications(id),
    info_source VARCHAR(100),
    permit_number VARCHAR(100),
    reference_number VARCHAR(100),
    application_date DATE,
    issue_date DATE,
    number_of_pets INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Processing',
    housing TEXT,
    picture_url TEXT,
    permit_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parrots
CREATE TABLE IF NOT EXISTS parrots (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    eri_bird_id VARCHAR(50),
    applicant_id INTEGER REFERENCES applicants(id),
    species_id INTEGER REFERENCES parrot_species(id),
    permit_id INTEGER REFERENCES permits(id),
    range_id INTEGER REFERENCES ranges(id),
    info_source VARCHAR(100),
    band_number VARCHAR(100),
    pet_name VARCHAR(100),
    sex VARCHAR(20),
    parrot_age_months NUMERIC,
    method_obtained VARCHAR(100),
    period_of_ownership_months NUMERIC,
    end_date DATE,
    housing_details TEXT,
    has_parrot VARCHAR(20),
    why_no_parrot TEXT,
    parrot_status VARCHAR(50),
    confiscated BOOLEAN DEFAULT false,
    inspection_id INTEGER,
    is_healthy BOOLEAN DEFAULT true,
    health_comments TEXT,
    stories TEXT,
    bird_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    applicant_id INTEGER REFERENCES applicants(id),
    inspector_id INTEGER REFERENCES users(id),
    range_id INTEGER REFERENCES ranges(id),
    inspection_date DATE,
    inspection_status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    followup_date DATE,
    followup_notes TEXT,
    birds_described TEXT,
    hand_tame BOOLEAN DEFAULT false,
    date_acquired DATE,
    instructions_for_applicant TEXT,
    expected_recheck DATE,
    preconditions_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for parrots inspection_id
ALTER TABLE parrots ADD CONSTRAINT fk_parrot_inspection
    FOREIGN KEY (inspection_id) REFERENCES inspections(id);

-- Calls
CREATE TABLE IF NOT EXISTS calls (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    eri_call_id VARCHAR(50),
    applicant_id INTEGER REFERENCES applicants(id),
    officer_id INTEGER REFERENCES users(id),
    number_called VARCHAR(20),
    call_date DATE,
    language VARCHAR(50),
    is_functional BOOLEAN DEFAULT false,
    is_answered BOOLEAN DEFAULT false,
    is_applicant BOOLEAN DEFAULT false,
    know_applicant BOOLEAN DEFAULT false,
    relation_applicant VARCHAR(100),
    new_applicant_contact VARCHAR(100),
    call_now_consent BOOLEAN DEFAULT false,
    call_later_consent BOOLEAN DEFAULT false,
    call_later_date DATE,
    is_fully_completed BOOLEAN DEFAULT false,
    scheduled_followup BOOLEAN DEFAULT false,
    followup_date DATE,
    consents_digital_resources BOOLEAN DEFAULT false,
    num_neighbors_parrots INTEGER,
    neighborhood_description TEXT,
    call_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compound Offenses
CREATE TABLE IF NOT EXISTS compound_offenses (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    eri_confiscation_id VARCHAR(50),
    applicant_id INTEGER REFERENCES applicants(id),
    officer_id INTEGER REFERENCES users(id),
    range_id INTEGER REFERENCES ranges(id),
    offense_date DATE,
    illegal_wildlife TEXT,
    hand_tame BOOLEAN DEFAULT false,
    date_acquired DATE,
    prior_history BOOLEAN DEFAULT false,
    health_issues TEXT,
    diet_notes TEXT,
    cage_size_feet VARCHAR(50),
    cage_confiscated BOOLEAN DEFAULT false,
    cage_location VARCHAR(100),
    reason_confiscated TEXT,
    signed_officer BOOLEAN DEFAULT false,
    signed_offender BOOLEAN DEFAULT false,
    signed_date DATE,
    offense_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    changes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applicants_uuid ON applicants(uuid);
CREATE INDEX IF NOT EXISTS idx_applicants_district ON applicants(district_id);
CREATE INDEX IF NOT EXISTS idx_permits_applicant ON permits(applicant_id);
CREATE INDEX IF NOT EXISTS idx_permits_range ON permits(range_id);
CREATE INDEX IF NOT EXISTS idx_permits_status ON permits(status);
CREATE INDEX IF NOT EXISTS idx_parrots_applicant ON parrots(applicant_id);
CREATE INDEX IF NOT EXISTS idx_parrots_range ON parrots(range_id);
CREATE INDEX IF NOT EXISTS idx_inspections_applicant ON inspections(applicant_id);
CREATE INDEX IF NOT EXISTS idx_inspections_range ON inspections(range_id);
CREATE INDEX IF NOT EXISTS idx_calls_applicant ON calls(applicant_id);
CREATE INDEX IF NOT EXISTS idx_offenses_range ON compound_offenses(range_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_range ON users(range_id);