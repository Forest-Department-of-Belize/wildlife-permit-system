-- ============================================================
-- Captive Wildlife Permit Management System
-- Belize Forestry Department
-- Database Schema & Seed Data
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    permissions JSON DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DISTRICTS
-- ============================================================
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- RANGES (Forest Stations)
-- ============================================================
CREATE TABLE IF NOT EXISTS ranges (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    district_id INTEGER REFERENCES districts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role_id INTEGER REFERENCES roles(id),
    range_id INTEGER REFERENCES ranges(id),
    is_active BOOLEAN DEFAULT true,
    setup_token VARCHAR(255),
    setup_token_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SESSION
-- ============================================================
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);

-- ============================================================
-- APPLICANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    eri_applicant_id VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    district_id INTEGER REFERENCES districts(id),
    range_id INTEGER REFERENCES ranges(id),
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
    process_status VARCHAR(100) DEFAULT 'Pending Call',
    applicant_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_applicants_range ON applicants(range_id);
CREATE INDEX IF NOT EXISTS idx_applicants_district ON applicants(district_id);

-- ============================================================
-- PARROT SPECIES
-- ============================================================
CREATE TABLE IF NOT EXISTS parrot_species (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    common_name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PERMITS
-- ============================================================
CREATE TABLE IF NOT EXISTS permits (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    applicant_id INTEGER REFERENCES applicants(id),
    range_id INTEGER REFERENCES ranges(id),
    application_id INTEGER,
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
CREATE INDEX IF NOT EXISTS idx_permits_applicant ON permits(applicant_id);
CREATE INDEX IF NOT EXISTS idx_permits_range ON permits(range_id);

-- ============================================================
-- PARROTS
-- ============================================================
CREATE TABLE IF NOT EXISTS parrots (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    applicant_id INTEGER REFERENCES applicants(id),
    species_id INTEGER REFERENCES parrot_species(id),
    permit_id INTEGER REFERENCES permits(id),
    range_id INTEGER REFERENCES ranges(id),
    band_number VARCHAR(100),
    pet_name VARCHAR(100),
    sex VARCHAR(20),
    parrot_age_months INTEGER,
    method_obtained VARCHAR(100),
    period_of_ownership_months INTEGER,
    housing_details TEXT,
    has_parrot VARCHAR(20),
    why_no_parrot TEXT,
    is_healthy BOOLEAN DEFAULT true,
    health_comments TEXT,
    stories TEXT,
    bird_comments TEXT,
    info_source VARCHAR(100),
    eri_bird_id VARCHAR(50),
    confiscated BOOLEAN DEFAULT false,
    inspection_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_parrots_applicant ON parrots(applicant_id);

-- ============================================================
-- APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    applicant_id INTEGER REFERENCES applicants(id),
    range_id INTEGER REFERENCES ranges(id),
    status VARCHAR(50) DEFAULT 'Pending',
    application_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INSPECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    applicant_id INTEGER REFERENCES applicants(id),
    range_id INTEGER REFERENCES ranges(id),
    inspector_name TEXT,
    inspection_date DATE,
    inspection_status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    followup_date DATE,
    followup_notes TEXT,
    birds_described TEXT,
    hand_tame BOOLEAN DEFAULT false,
    instructions_for_applicant TEXT,
    expected_recheck DATE,
    preconditions_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_inspections_applicant ON inspections(applicant_id);

-- ============================================================
-- CALLS
-- ============================================================
CREATE TABLE IF NOT EXISTS calls (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    applicant_id INTEGER REFERENCES applicants(id),
    officer_id INTEGER REFERENCES users(id),
    officer_name TEXT,
    number_called VARCHAR(20),
    call_date DATE,
    language VARCHAR(50),
    is_functional BOOLEAN DEFAULT false,
    is_answered BOOLEAN DEFAULT false,
    is_applicant BOOLEAN DEFAULT false,
    is_fully_completed BOOLEAN DEFAULT false,
    call_now_consent BOOLEAN DEFAULT false,
    call_later_consent BOOLEAN DEFAULT false,
    call_later_date DATE,
    consents_digital_resources BOOLEAN DEFAULT false,
    num_neighbors_parrots INTEGER DEFAULT 0,
    neighborhood_description TEXT,
    call_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_calls_applicant ON calls(applicant_id);

-- ============================================================
-- COMPOUND OFFENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS compound_offenses (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
    applicant_id INTEGER REFERENCES applicants(id),
    officer_id INTEGER REFERENCES users(id),
    officer_name TEXT,
    range_id INTEGER REFERENCES ranges(id),
    offense_date DATE,
    illegal_wildlife TEXT,
    cage_size_feet VARCHAR(50),
    cage_location VARCHAR(100),
    reason_confiscated TEXT,
    hand_tame BOOLEAN DEFAULT false,
    prior_history BOOLEAN DEFAULT false,
    cage_confiscated BOOLEAN DEFAULT false,
    signed_officer BOOLEAN DEFAULT false,
    signed_offender BOOLEAN DEFAULT false,
    signed_date DATE,
    health_issues TEXT,
    diet_notes TEXT,
    offense_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_offenses_applicant ON compound_offenses(applicant_id);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100),
    table_name VARCHAR(100),
    record_id INTEGER,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Roles
INSERT INTO roles (name, permissions) VALUES
('Wildlife Program Manager', '["applicants-view","applicants-add","applicants-edit","applicants-delete","parrots-view","parrots-add","parrots-edit","parrots-delete","permits-view","permits-add","permits-edit","permits-delete","applications-view","applications-add","applications-edit","applications-delete","inspections-view","inspections-add","inspections-edit","inspections-delete","calls-view","calls-add","calls-edit","calls-delete","offenses-view","offenses-add","offenses-edit","offenses-delete","species-view","species-add","species-edit","species-delete","districts-view","districts-add","districts-edit","districts-delete","ranges-view","ranges-add","ranges-edit","ranges-delete","users-view","users-add","users-edit","users-delete"]'),
('Range OIC', '["applicants-view","applicants-add","applicants-edit","applicants-delete","parrots-view","parrots-add","parrots-edit","parrots-delete","permits-view","permits-add","permits-edit","inspections-view","inspections-add","inspections-edit","calls-view","calls-add","calls-edit","offenses-view","offenses-add","offenses-edit","species-view","species-add","species-edit"]'),
('Range Staff', '["applicants-view","applicants-add","applicants-edit","parrots-view","parrots-add","parrots-edit","permits-view","permits-add","inspections-view","inspections-add","calls-view","calls-add","offenses-view","offenses-add"]'),
('Intern', '["applicants-view","applicants-add","applicants-edit","parrots-view","parrots-add","parrots-edit","permits-view","permits-add","inspections-view","inspections-add"]')
ON CONFLICT (name) DO NOTHING;

-- Districts
INSERT INTO districts (name) VALUES
('Belize'),
('Cayo'),
('Corozal'),
('Orange Walk'),
('Stann Creek'),
('Toledo')
ON CONFLICT DO NOTHING;

-- Forest Stations
INSERT INTO ranges (name, district_id) VALUES
('Orange Walk Forest Station', 4),
('Belmopan Headquarters', 2),
('San Ignacio Forest Station', 2),
('Douglas D Silva Forest Station', 2),
('Savanna Forest Station', 5),
('Machaca Forest Station', 6)
ON CONFLICT DO NOTHING;

-- Parrot Species
INSERT INTO parrot_species (common_name, scientific_name) VALUES
('Scarlet Macaw', 'Ara macao'),
('Yellow-headed Parrot', 'Amazona oratrix'),
('Mealy Parrot', 'Amazona farinosa'),
('Red-lored Parrot', 'Amazona autumnalis'),
('White-fronted Parrot', 'Amazona albifrons'),
('White-crowned Parrot', 'Pionus senilis'),
('Yellow-lored Parrot', 'Amazona xantholora'),
('Brown-hooded Parrot', 'Pyrilia haematotis'),
('Olive-throated Parakeet', 'Eupsittula nana')
ON CONFLICT DO NOTHING;

-- Admin User (password: Admin@2026)
-- Note: Password is bcrypt hashed. Generate a new hash if needed.
-- To generate: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin@2026', 10).then(h => console.log(h))"
INSERT INTO users (first_name, last_name, email, password, role_id, is_active)
SELECT 'Admin', 'User', 'admin@forestry.gov.bz',
    '$2b$10$YourHashHere',
    r.id, true
FROM roles r WHERE r.name = 'Wildlife Program Manager'
ON CONFLICT (email) DO NOTHING;