import csv
import os
import re

READY = 'data/ready'
OUTPUT = 'data/migration.sql'

# --- Normalization maps ---

DISTRICT_NORMALIZE = {
    'cayo': 'Cayo',
    'stann Creek': 'Stann Creek',
}

CANONICAL_DISTRICTS = [
    'Belize', 'Cayo', 'Corozal', 'Orange Walk', 'Stann Creek', 'Toledo', 'United States'
]

RANGE_NORMALIZE = {
    'OW': 'Orange Walk',
    'SanIg': 'San Ignacio',
}

CANONICAL_RANGES = ['Belmopan', 'Cayo', 'Orange Walk', 'San Ignacio', 'Savannah', 'Toledo']

RANGE_TO_DISTRICT = {
    'Belmopan': 'Cayo',
    'Cayo': 'Cayo',
    'Orange Walk': 'Orange Walk',
    'San Ignacio': 'Cayo',
    'Savannah': 'Stann Creek',
    'Toledo': 'Toledo',
}

OFFICERS = {
    'Officer_1': {'first': 'Kristy', 'last': 'Tillet', 'email': 'kristy.tillet@forestdept.gov.bz'},
    'Officer_2': {'first': 'Erwin', 'last': 'Gilllet', 'email': 'erwin.gilllet@forestdept.gov.bz'},
    'Officer_3': {'first': 'Shirlene', 'last': 'Audineffe', 'email': 'shirlene.audineffe@forestdept.gov.bz'},
}

# --- Helpers ---

def read_csv_file(filename):
    path = os.path.join(READY, filename)
    with open(path, 'r', encoding='utf-8') as f:
        rows = list(csv.reader(f))
    return rows[0], rows[1:]


def sql_escape(val):
    return val.replace("'", "''")


def sql_val(val, col_type='text'):
    if val == 'NULL' or val == '' or val is None:
        return 'NULL'
    if col_type == 'boolean':
        return 'true' if val == 'true' else 'false'
    if col_type == 'integer':
        try:
            return str(int(val))
        except ValueError:
            return 'NULL'
    if col_type == 'date':
        v = val.strip()
        if re.match(r'^\d{4}-\d{2}-\d{2}', v):
            return f"'{v[:10]}'"
        return 'NULL'
    return f"'{sql_escape(val)}'"


def normalize_district(val):
    if val == 'NULL' or val == '':
        return None
    return DISTRICT_NORMALIZE.get(val, val)


def normalize_range(val):
    if val == 'NULL' or val == '':
        return None
    return RANGE_NORMALIZE.get(val, val)


def district_subq(name):
    if name is None:
        return 'NULL'
    return f"(SELECT id FROM districts WHERE name = '{sql_escape(name)}')"


def range_subq(name):
    if name is None:
        return 'NULL'
    return f"(SELECT id FROM ranges WHERE name = '{sql_escape(name)}')"


def applicant_subq(eri_id):
    if eri_id == 'NULL' or eri_id == '' or eri_id == 'Anonymous':
        return 'NULL'
    return f"(SELECT id FROM applicants WHERE eri_applicant_id = '{sql_escape(eri_id)}')"


def permit_subq(permit_number, applicant_eri):
    if permit_number == 'NULL' or permit_number == '':
        return 'NULL'
    if applicant_eri and applicant_eri != 'NULL':
        return (f"(SELECT id FROM permits WHERE permit_number = '{sql_escape(permit_number)}' "
                f"AND applicant_id = (SELECT id FROM applicants WHERE eri_applicant_id = '{sql_escape(applicant_eri)}') "
                f"LIMIT 1)")
    return f"(SELECT id FROM permits WHERE permit_number = '{sql_escape(permit_number)}' LIMIT 1)"


# --- Column mappings (CSV col name -> (sql_col_name, type)) ---
# Types: 'varchar', 'text', 'boolean', 'integer', 'date'
# Special: 'ref:district', 'ref:range', 'ref:applicant', 'ref:permit', 'ref:officer', '_skip'

APPLICANTS_COLS = {
    'eri_applicant_id': ('eri_applicant_id', 'varchar'),
    'first_name': ('first_name', 'varchar'),
    'last_name': ('last_name', 'varchar'),
    'date_of_birth': ('date_of_birth', 'date'),
    'address1': ('address1', 'varchar'),
    'address2': ('address2', 'varchar'),
    'district': ('district_id', 'ref:district'),
    'contact_number': ('contact_number', 'varchar'),
    'contact_number_whatsapp': ('contact_number_whatsapp', 'boolean'),
    'contact_secondary': ('contact_secondary', 'varchar'),
    'contact_secondary_whatsapp': ('contact_secondary_whatsapp', 'boolean'),
    'email': ('email', 'varchar'),
    'occupation': ('occupation', 'varchar'),
    'company': ('company', 'varchar'),
    'government_id_type': ('government_id_type', 'varchar'),
    'government_id_number': ('government_id_number', 'varchar'),
    'applicant_status': ('applicant_status', 'varchar'),
    'info_source': ('info_source', 'varchar'),
    'parrot_diet': ('parrot_diet', 'text'),
    'enclosure_type': ('enclosure_type', 'varchar'),
    'cage_location': ('cage_location', 'varchar'),
    'cage_size_feet': ('cage_size_feet', 'varchar'),
    'shared_separate': ('shared_separate', 'varchar'),
    'does_fly_free': ('does_fly_free', 'boolean'),
    'fly_free_when': ('fly_free_when', 'varchar'),
    'are_wings_cut': ('are_wings_cut', 'boolean'),
    'applicant_comments': ('applicant_comments', 'text'),
    'ownership_comments': ('ownership_comments', 'text'),
    'id': (None, '_skip'),
}

APPLICATIONS_COLS = {
    'eri_application_id': ('eri_application_id', 'varchar'),
    'application_id': (None, '_skip'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'applicant_id': (None, '_skip'),
    'info_source': ('info_source', 'varchar'),
    'status': ('status', 'varchar'),
    'range': ('range_id', 'ref:range'),
    'application_date': ('application_date', 'date'),
    'application_signed': ('application_signed', 'boolean'),
    'followup_done': ('followup_done', 'boolean'),
    'followup_details': ('followup_details', 'text'),
    'applied_previously': ('applied_previously', 'boolean'),
    'applied_previously_date': ('applied_previously_date', 'date'),
    'previously_approved': ('previously_approved', 'boolean'),
    'application_experience': ('application_experience', 'text'),
    'application_comments': ('application_comments', 'text'),
}

CALLS_COLS = {
    'eri_call_id': ('eri_call_id', 'varchar'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'number_called': ('number_called', 'varchar'),
    'officer_name': ('officer_name', 'text'),
    'call_date': ('call_date', 'date'),
    'language': ('language', 'varchar'),
    'is_functional': ('is_functional', 'boolean'),
    'is_answered': ('is_answered', 'boolean'),
    'is_applicant': ('is_applicant', 'boolean'),
    'know_applicant': ('know_applicant', 'boolean'),
    'relation_applicant': ('relation_applicant', 'varchar'),
    'new_applicant_contact': ('new_applicant_contact', 'varchar'),
    'call_now_consent': ('call_now_consent', 'boolean'),
    'call_later_consent': ('call_later_consent', 'boolean'),
    'call_later_date': ('call_later_date', 'date'),
    'is_fully_completed': ('is_fully_completed', 'boolean'),
    'scheduled_followup': ('scheduled_followup', 'boolean'),
    'followup_date': ('followup_date', 'date'),
    'consents_digital_resources': ('consents_digital_resources', 'boolean'),
    'num_neighbors_parrots': ('num_neighbors_parrots', 'integer'),
    'neighborhood_description': ('neighborhood_description', 'text'),
    'call_comments': ('call_comments', 'text'),
}

COMMENTS_COLS = {
    'eri_comment_id': ('eri_comment_id', 'varchar'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'comment_date': ('comment_date', 'date'),
    'comment_comments': ('comment_comments', 'text'),
}

COMPOUND_OFFENSES_COLS = {
    'eri_confiscation_id': ('eri_confiscation_id', 'varchar'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'range': ('range_id', 'ref:range'),
    'offense_date': ('offense_date', 'date'),
    'illegal_wildlife': ('illegal_wildlife', 'text'),
    'cage_size_feet': ('cage_size_feet', 'varchar'),
    'cage_location': ('cage_location', 'varchar'),
    'reason_confiscated': ('reason_confiscated', 'text'),
    'hand_tame': ('hand_tame', 'boolean'),
    'approx_date_acquired': ('approx_date_acquired', 'varchar'),
    'less_12_months_acquired': ('less_12_months_acquired', 'boolean'),
    'prior_history': ('prior_history', 'boolean'),
    'health_issues': ('health_issues', 'text'),
    'diet_notes': ('diet_notes', 'text'),
    'cage_confiscated': ('cage_confiscated', 'boolean'),
    'signed_officer': ('signed_officer', 'boolean'),
    'signed_offender': ('signed_offender', 'boolean'),
    'signed_date': ('signed_date', 'date'),
    'offense_comments': ('offense_comments', 'text'),
}

INSPECTIONS_COLS = {
    'eri_inspection_id': ('eri_inspection_id', 'varchar'),
    'eri_preconditions_id': ('eri_preconditions_id', 'varchar'),
    'officer_id_eri': ('officer_id', 'ref:officer'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'inspection_date': ('inspection_date', 'date'),
    'approx_report_date': ('approx_report_date', 'date'),
    'when_approx_report_date_provided': ('when_approx_report_date_provided', 'date'),
    'birds_described': ('birds_described', 'text'),
    'hand_tame': ('hand_tame', 'boolean'),
    'date_acquired': ('date_acquired', 'date'),
    'approx_date_acquired': ('approx_date_acquired', 'varchar'),
    'less_12_months_acquired': ('less_12_months_acquired', 'boolean'),
    'instructions_for_applicant': ('instructions_for_applicant', 'text'),
    'expected_recheck': ('expected_recheck', 'date'),
    'preconditions_comments': ('preconditions_comments', 'text'),
}

PERMITS_COLS = {
    'permit_number': ('permit_number', 'varchar'),
    'id': (None, '_skip'),
    'info_source': ('info_source', 'varchar'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'applicant_id': (None, '_skip'),
    'status': ('status', 'varchar'),
    'picture_url': ('picture_url', 'text'),
    'range': ('range_id', 'ref:range'),
    'reference_number': ('reference_number', 'varchar'),
    'issue_date': ('issue_date', 'date'),
    'housing': ('housing', 'text'),
    'number_of_pets': ('number_of_pets', 'integer'),
    'permit_comments': ('permit_comments', 'text'),
}

PARROTS_COLS = {
    'eri_bird_id': ('eri_bird_id', 'varchar'),
    'id': (None, '_skip'),
    'eri_application_id': ('eri_application_id', 'varchar'),
    'applicant_id_eri': ('applicant_id', 'ref:applicant'),
    'info_source': ('info_source', 'varchar'),
    'banded': ('banded', 'boolean'),
    'band_number': ('band_number', 'varchar'),
    'permit_id': ('permit_id', 'ref:permit'),
    'parrot_status': ('parrot_status', 'varchar'),
    'end_date': ('end_date', 'date'),
    'range': ('range_id', 'ref:range'),
    'has_parrot': ('has_parrot', 'boolean'),
    'why_no_parrot': ('why_no_parrot', 'text'),
    'when_no_parrot': ('when_no_parrot', 'text'),
    'where_no_parrot': ('where_no_parrot', 'text'),
    'date_parrot_loss_info_provided': ('date_parrot_loss_info_provided', 'date'),
    'new_owner': ('new_owner', 'varchar'),
    'new_owner_address': ('new_owner_address', 'varchar'),
    'new_owner_contact': ('new_owner_contact', 'varchar'),
    'species_descrip_by_applicant': ('species_descrip_by_applicant', 'text'),
    'species_id': ('species_id', 'integer'),
    'parrot_picture': ('parrot_picture', 'text'),
    'period_of_ownership': ('period_of_ownership', 'text'),
    'period_of_ownership_months': ('period_of_ownership_months', 'integer'),
    'date_period_provided': ('date_period_provided', 'date'),
    'method_obtained': ('method_obtained', 'varchar'),
    'town_obtained': ('town_obtained', 'varchar'),
    'district_obtain': ('district_obtain', 'varchar'),
    'pet_name': ('pet_name', 'varchar'),
    'sex': ('sex', 'varchar'),
    'justification_sex_by_applicant': ('justification_sex_by_applicant', 'text'),
    'parrot_age_description': ('parrot_age_description', 'text'),
    'parrot_age_months': ('parrot_age_months', 'integer'),
    'date_parrot_age_described': ('date_parrot_age_described', 'date'),
    'is_healthy': ('is_healthy', 'boolean'),
    'health_comments': ('health_comments', 'text'),
    'health_comms_by_professional': ('health_comms_by_professional', 'text'),
    'stories': ('stories', 'text'),
    'bird_comments': ('bird_comments', 'text'),
}

PARROT_SPECIES_COLS = {
    'id': ('id', 'integer'),
    'common_name': ('common_name', 'varchar'),
    'scientific_name': ('scientific_name', 'varchar'),
}


def build_insert(table, col_map, header, row):
    sql_cols = []
    sql_vals = []
    for csv_col in header:
        if csv_col not in col_map:
            continue
        sql_col, col_type = col_map[csv_col]
        if col_type == '_skip' or sql_col is None:
            continue

        idx = header.index(csv_col)
        val = row[idx] if idx < len(row) else ''

        if col_type == 'ref:district':
            sql_cols.append(sql_col)
            sql_vals.append(district_subq(normalize_district(val)))
        elif col_type == 'ref:range':
            sql_cols.append(sql_col)
            sql_vals.append(range_subq(normalize_range(val)))
        elif col_type == 'ref:applicant':
            sql_cols.append(sql_col)
            sql_vals.append(applicant_subq(val))
        elif col_type == 'ref:officer':
            sql_cols.append(sql_col)
            if val == 'NULL' or val == '':
                sql_vals.append('NULL')
            else:
                sql_vals.append(f"(SELECT user_id FROM _officer_map WHERE eri_id = '{sql_escape(val)}')")
        elif col_type == 'ref:permit':
            sql_cols.append(sql_col)
            aeri_idx = header.index('applicant_id_eri') if 'applicant_id_eri' in header else -1
            aeri = row[aeri_idx] if aeri_idx >= 0 and aeri_idx < len(row) else None
            sql_vals.append(permit_subq(val, aeri))
        else:
            sql_cols.append(sql_col)
            sql_vals.append(sql_val(val, col_type))

    return sql_cols, sql_vals


# --- Main generation ---

def main():
    print('Reading CSVs...')
    species_h, species_d = read_csv_file('ParrotSpecies.csv')
    applicants_h, applicants_d = read_csv_file('Applicants.csv')
    permits_h, permits_d = read_csv_file('Permits.csv')
    applications_h, applications_d = read_csv_file('Applications.csv')
    calls_h, calls_d = read_csv_file('Calls.csv')
    comments_h, comments_d = read_csv_file('Comments.csv')
    offenses_h, offenses_d = read_csv_file('CompoundOffenses.csv')
    inspections_h, inspections_d = read_csv_file('Preconditions.csv')
    parrots_h, parrots_d = read_csv_file('Parrots.csv')
    officers_h, officers_d = read_csv_file('Officers.csv')

    print(f'  Applicants: {len(applicants_d)} rows')
    print(f'  Applications: {len(applications_d)} rows')
    print(f'  Calls: {len(calls_d)} rows')
    print(f'  Comments: {len(comments_d)} rows')
    print(f'  CompoundOffenses: {len(offenses_d)} rows')
    print(f'  Inspections: {len(inspections_d)} rows')
    print(f'  Officers: {len(officers_d)} rows')
    print(f'  ParrotSpecies: {len(species_d)} rows')
    print(f'  Parrots: {len(parrots_d)} rows')
    print(f'  Permits: {len(permits_d)} rows')

    with open(OUTPUT, 'w', encoding='utf-8') as out:
        out.write('-- Wildlife Permit System: Data Migration\n')
        out.write('-- Generated by generate_migration.py\n')
        out.write('-- DO NOT EDIT MANUALLY\n\n')
        out.write('BEGIN;\n\n')

        # Phase 0: Truncate target tables
        out.write('-- ============================================================\n')
        out.write('-- Phase 0: Truncate target tables (CASCADE)\n')
        out.write('-- ============================================================\n\n')
        truncate_tables = [
            'parrots', 'inspections', 'compound_offenses', 'comments',
            'calls', 'applications', 'permits', 'applicants',
            'parrot_species', 'ranges', 'districts'
        ]
        out.write(f"TRUNCATE TABLE {', '.join(truncate_tables)} CASCADE;\n\n")

        # Phase 1: Lookup tables
        out.write('-- ============================================================\n')
        out.write('-- Phase 1: Lookup tables\n')
        out.write('-- ============================================================\n\n')

        # Districts
        out.write('-- Districts\n')
        for d in CANONICAL_DISTRICTS:
            out.write(f"INSERT INTO districts (name) VALUES ('{sql_escape(d)}');\n")
        out.write('\n')

        # Ranges
        out.write('-- Ranges (with district FK)\n')
        for r in CANONICAL_RANGES:
            dist = RANGE_TO_DISTRICT[r]
            out.write(f"INSERT INTO ranges (name, district_id) VALUES ('{sql_escape(r)}', "
                       f"(SELECT id FROM districts WHERE name = '{sql_escape(dist)}'));\n")
        out.write('\n')

        # Parrot Species (force IDs)
        out.write('-- Parrot Species (preserving canonical IDs)\n')
        id_idx = species_h.index('id')
        cn_idx = species_h.index('common_name')
        sn_idx = species_h.index('scientific_name')
        for row in species_d:
            sid = row[id_idx]
            cn = sql_val(row[cn_idx], 'varchar')
            sn = sql_val(row[sn_idx], 'varchar')
            out.write(f"INSERT INTO parrot_species (id, common_name, scientific_name) VALUES ({sid}, {cn}, {sn});\n")
        out.write("SELECT setval('parrot_species_id_seq', (SELECT MAX(id) FROM parrot_species));\n\n")

        # Officers -> Users (with temp mapping table)
        out.write('-- Officers -> Users + mapping table\n')
        out.write('CREATE TEMP TABLE _officer_map (eri_id varchar(50), user_id integer);\n\n')

        eri_idx = officers_h.index('eri_officer_id')
        for row in officers_d:
            eri = row[eri_idx]
            if eri in OFFICERS:
                o = OFFICERS[eri]
                out.write(f"INSERT INTO users (first_name, last_name, email) VALUES "
                           f"('{sql_escape(o['first'])}', '{sql_escape(o['last'])}', '{sql_escape(o['email'])}');\n")
                out.write(f"INSERT INTO _officer_map (eri_id, user_id) VALUES "
                           f"('{sql_escape(eri)}', (SELECT id FROM users WHERE email = '{sql_escape(o['email'])}'));\n")
        out.write('\n')

        # Phase 2: Applicants
        out.write('-- ============================================================\n')
        out.write(f'-- Phase 2: Applicants ({len(applicants_d)} rows)\n')
        out.write('-- ============================================================\n\n')

        for i, row in enumerate(applicants_d):
            cols, vals = build_insert('applicants', APPLICANTS_COLS, applicants_h, row)
            out.write(f"INSERT INTO applicants ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
            if (i + 1) % 500 == 0:
                print(f'  Applicants: {i+1}/{len(applicants_d)}')
        out.write('\n')
        print(f'  Applicants: {len(applicants_d)}/{len(applicants_d)} done')

        # Phase 3: Permits, Applications, Calls, Comments
        out.write('-- ============================================================\n')
        out.write('-- Phase 3: Permits, Applications, Calls, Comments\n')
        out.write('-- ============================================================\n\n')

        out.write(f'-- Permits ({len(permits_d)} rows)\n')
        for row in permits_d:
            cols, vals = build_insert('permits', PERMITS_COLS, permits_h, row)
            out.write(f"INSERT INTO permits ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        out.write('\n')
        print(f'  Permits: {len(permits_d)} done')

        out.write(f'-- Applications ({len(applications_d)} rows)\n')
        for row in applications_d:
            cols, vals = build_insert('applications', APPLICATIONS_COLS, applications_h, row)
            out.write(f"INSERT INTO applications ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        out.write('\n')
        print(f'  Applications: {len(applications_d)} done')

        out.write(f'-- Calls ({len(calls_d)} rows)\n')
        for row in calls_d:
            cols, vals = build_insert('calls', CALLS_COLS, calls_h, row)
            out.write(f"INSERT INTO calls ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        out.write('\n')
        print(f'  Calls: {len(calls_d)} done')

        out.write(f'-- Comments ({len(comments_d)} rows)\n')
        for row in comments_d:
            cols, vals = build_insert('comments', COMMENTS_COLS, comments_h, row)
            out.write(f"INSERT INTO comments ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        out.write('\n')
        print(f'  Comments: {len(comments_d)} done')

        # Phase 4: CompoundOffenses, Inspections
        out.write('-- ============================================================\n')
        out.write('-- Phase 4: CompoundOffenses, Inspections\n')
        out.write('-- ============================================================\n\n')

        out.write(f'-- CompoundOffenses ({len(offenses_d)} rows)\n')
        for row in offenses_d:
            cols, vals = build_insert('compound_offenses', COMPOUND_OFFENSES_COLS, offenses_h, row)
            out.write(f"INSERT INTO compound_offenses ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        out.write('\n')
        print(f'  CompoundOffenses: {len(offenses_d)} done')

        out.write(f'-- Inspections ({len(inspections_d)} rows)\n')
        for row in inspections_d:
            cols, vals = build_insert('inspections', INSPECTIONS_COLS, inspections_h, row)
            out.write(f"INSERT INTO inspections ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        out.write('\n')
        print(f'  Inspections: {len(inspections_d)} done')

        # Phase 5: Parrots
        out.write('-- ============================================================\n')
        out.write(f'-- Phase 5: Parrots ({len(parrots_d)} rows)\n')
        out.write('-- ============================================================\n\n')

        for i, row in enumerate(parrots_d):
            cols, vals = build_insert('parrots', PARROTS_COLS, parrots_h, row)
            out.write(f"INSERT INTO parrots ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
            if (i + 1) % 500 == 0:
                print(f'  Parrots: {i+1}/{len(parrots_d)}')
        out.write('\n')
        print(f'  Parrots: {len(parrots_d)}/{len(parrots_d)} done')

        # Phase 6: Reset sequences
        out.write('-- ============================================================\n')
        out.write('-- Phase 6: Reset serial sequences\n')
        out.write('-- ============================================================\n\n')

        seq_tables = [
            'districts', 'ranges', 'parrot_species', 'users',
            'applicants', 'permits', 'applications', 'calls',
            'comments', 'compound_offenses', 'inspections', 'parrots'
        ]
        for t in seq_tables:
            out.write(f"SELECT setval('{t}_id_seq', COALESCE((SELECT MAX(id) FROM {t}), 0));\n")
        out.write('\n')

        # Cleanup temp table
        out.write('DROP TABLE IF EXISTS _officer_map;\n\n')

        out.write('COMMIT;\n')

    size_mb = os.path.getsize(OUTPUT) / (1024 * 1024)
    print(f'\nGenerated {OUTPUT} ({size_mb:.1f} MB)')
    print('Done!')


if __name__ == '__main__':
    main()
