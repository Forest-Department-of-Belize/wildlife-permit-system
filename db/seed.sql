-- Insert Districts
INSERT INTO districts (name) VALUES
('Belize'),
('Cayo'),
('Corozal'),
('Orange Walk'),
('Stann Creek'),
('Toledo')
ON CONFLICT DO NOTHING;

-- Insert Ranges (Forest Stations)
INSERT INTO ranges (name, district_id) VALUES
('Orange Walk Forest Station', (SELECT id FROM districts WHERE name = 'Orange Walk')),
('Belmopan Headquarters', (SELECT id FROM districts WHERE name = 'Cayo')),
('San Ignacio Forest Station', (SELECT id FROM districts WHERE name = 'Cayo')),
('Douglas D Silva Forest Station', (SELECT id FROM districts WHERE name = 'Toledo')),
('Savanna Forest Station', (SELECT id FROM districts WHERE name = 'Stann Creek')),
('Machaca Forest Station', (SELECT id FROM districts WHERE name = 'Cayo'))
ON CONFLICT DO NOTHING;

-- Insert Roles
INSERT INTO roles (name, permissions) VALUES
('Wildlife Program Manager', '["applicants-view","applicants-add","applicants-edit","applicants-delete","parrots-view","parrots-add","parrots-edit","parrots-delete","permits-view","permits-add","permits-edit","permits-delete","applications-view","applications-add","applications-edit","applications-delete","inspections-view","inspections-add","inspections-edit","inspections-delete","calls-view","calls-add","calls-edit","calls-delete","offenses-view","offenses-add","offenses-edit","offenses-delete","species-view","species-add","species-edit","species-delete","districts-view","districts-add","districts-edit","districts-delete","ranges-view","ranges-add","ranges-edit","ranges-delete","users-view","users-add","users-edit","users-delete","roles-view","roles-add","roles-edit","roles-delete","import-data"]'),
('Range OIC', '["applicants-view","applicants-add","applicants-edit","parrots-view","parrots-add","parrots-edit","permits-view","permits-add","permits-edit","applications-view","applications-add","applications-edit","inspections-view","inspections-add","inspections-edit","calls-view","calls-add","calls-edit","offenses-view","offenses-add","offenses-edit","species-view","ranges-view","users-view","users-edit"]'),
('Range Staff', '["applicants-view","applicants-add","parrots-view","parrots-add","permits-view","permits-add","applications-view","applications-add","inspections-view","inspections-add","calls-view","calls-add","offenses-view","offenses-add","species-view"]')
ON CONFLICT DO NOTHING;

-- Insert Parrot Species
INSERT INTO parrot_species (common_name, scientific_name) VALUES
('Red-lored Parrot', 'Amazona autumnalis'),
('Yellow-headed Parrot', 'Amazona oratrix'),
('White-fronted Parrot', 'Amazona albifrons'),
('Mealy Parrot', 'Amazona farinosa'),
('Yellow-lored Parrot', 'Amazona xantholora'),
('White-crowned Parrot', 'Pionus senilis'),
('Brown-hooded Parrot', 'Pyrilia haematotis'),
('Orange-winged Parrot', 'Amazona amazonica'),
('Blue-crowned Parrot', 'Pionus menstruus'),
('Scarlet Macaw', 'Ara macao'),
('Green Parakeet', 'Psittacara holochlorus'),
('Olive-throated Parakeet', 'Eupsittula nana'),
('Yellow-lored Amazon', 'Amazona xantholora'),
('Black-headed Parrot', 'Pionites melanocephalus'),
('White-capped Parrot', 'Pionus senilis'),
('Red-fronted Parrotlet', 'Touit costaricensis')
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: Admin@2026)
INSERT INTO users (first_name, last_name, email, password, role_id, range_id, is_active, first_login)
VALUES (
    'System',
    'Admin',
    'admin@forestry.gov.bz',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    (SELECT id FROM roles WHERE name = 'Wildlife Program Manager'),
    NULL,
    true,
    false
)
ON CONFLICT DO NOTHING;