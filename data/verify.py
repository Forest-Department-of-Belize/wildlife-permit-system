import csv, os, re

ready = 'data/ready'

# Schema definitions extracted from schema.ts
# Format: { csv_col_name: (sql_type, max_length_or_None) }
# Types: 'serial', 'varchar', 'text', 'boolean', 'integer', 'date', 'timestamp', 'uuid', 'json'
# We skip auto-generated cols: id, uuid, created_at, updated_at

# Also track which CSV cols map to FK references (district, range, applicant_id_eri, etc.)
# These are cross-reference cols that won't be direct schema cols but are needed for import.

schema = {
    'Applicants.csv': {
        'table': 'applicants',
        'columns': {
            'eri_applicant_id': ('varchar', 50),
            'first_name': ('varchar', 100),
            'middle_name': ('varchar', 100),
            'last_name': ('varchar', 100),
            'date_of_birth': ('date', None),
            'address1': ('varchar', 255),
            'address2': ('varchar', 255),
            'district': ('ref:districts', None),
            'contact_number': ('varchar', 20),
            'contact_number_whatsapp': ('boolean', None),
            'contact_secondary': ('varchar', 255),
            'contact_secondary_whatsapp': ('boolean', None),
            'email': ('varchar', 255),
            'occupation': ('varchar', 100),
            'company': ('varchar', 100),
            'government_id_type': ('varchar', 50),
            'government_id_number': ('varchar', 100),
            'applicant_status': ('varchar', 50),
            'info_source': ('varchar', 100),
            'parrot_diet': ('text', None),
            'enclosure_type': ('varchar', 100),
            'cage_location': ('varchar', 100),
            'cage_size_feet': ('varchar', 50),
            'shared_separate': ('varchar', 50),
            'does_fly_free': ('boolean', None),
            'fly_free_when': ('varchar', 100),
            'are_wings_cut': ('boolean', None),
            'applicant_comments': ('text', None),
            'ownership_comments': ('text', None),
            'process_status': ('varchar', 100),
            'applicant_notes': ('text', None),
            'id': ('_old_id', None),
        },
    },
    'Applications.csv': {
        'table': 'applications',
        'columns': {
            'eri_application_id': ('varchar', 50),
            'application_id': ('_old_id', None),
            'applicant_id_eri': ('ref:applicants', None),
            'applicant_id': ('_old_fk', None),
            'info_source': ('varchar', 100),
            'status': ('varchar', 50),
            'range': ('ref:ranges', None),
            'application_date': ('date', None),
            'application_signed': ('boolean', None),
            'followup_done': ('boolean', None),
            'followup_details': ('text', None),
            'applied_previously': ('boolean', None),
            'applied_previously_date': ('date', None),
            'previously_approved': ('boolean', None),
            'application_experience': ('text', None),
            'application_comments': ('text', None),
        },
    },
    'Calls.csv': {
        'table': 'calls',
        'columns': {
            'eri_call_id': ('varchar', 50),
            'applicant_id_eri': ('ref:applicants', None),
            'number_called': ('varchar', 20),
            'officer_name': ('text', None),
            'call_date': ('date', None),
            'language': ('varchar', 50),
            'is_functional': ('boolean', None),
            'is_answered': ('boolean', None),
            'is_applicant': ('boolean', None),
            'know_applicant': ('boolean', None),
            'relation_applicant': ('varchar', 100),
            'new_applicant_contact': ('varchar', 20),
            'call_now_consent': ('boolean', None),
            'call_later_consent': ('boolean', None),
            'call_later_date': ('date', None),
            'is_fully_completed': ('boolean', None),
            'scheduled_followup': ('boolean', None),
            'followup_date': ('date', None),
            'consents_digital_resources': ('boolean', None),
            'num_neighbors_parrots': ('integer', None),
            'neighborhood_description': ('text', None),
            'call_comments': ('text', None),
        },
    },
    'Comments.csv': {
        'table': 'comments',
        'columns': {
            'eri_comment_id': ('varchar', 50),
            'applicant_id_eri': ('ref:applicants', None),
            'comment_date': ('date', None),
            'comment_comments': ('text', None),
        },
    },
    'CompoundOffenses.csv': {
        'table': 'compound_offenses',
        'columns': {
            'eri_confiscation_id': ('varchar', 50),
            'applicant_id_eri': ('ref:applicants', None),
            'range': ('ref:ranges', None),
            'offense_date': ('date', None),
            'illegal_wildlife': ('text', None),
            'cage_size_feet': ('varchar', 50),
            'cage_location': ('varchar', 100),
            'reason_confiscated': ('text', None),
            'hand_tame': ('boolean', None),
            'approx_date_acquired': ('varchar', 100),
            'less_12_months_acquired': ('boolean', None),
            'prior_history': ('boolean', None),
            'health_issues': ('text', None),
            'diet_notes': ('text', None),
            'cage_confiscated': ('boolean', None),
            'signed_officer': ('boolean', None),
            'signed_offender': ('boolean', None),
            'signed_date': ('date', None),
            'offense_comments': ('text', None),
        },
    },
    'Officers.csv': {
        'table': 'users',
        'columns': {
            'eri_officer_id': ('varchar', 50),
            'officer_name': ('text', None),
        },
    },
    'ParrotSpecies.csv': {
        'table': 'parrot_species',
        'columns': {
            'id': ('integer', None),
            'common_name': ('varchar', 100),
            'scientific_name': ('varchar', 100),
        },
    },
    'Parrots.csv': {
        'table': 'parrots',
        'columns': {
            'eri_bird_id': ('varchar', 50),
            'id': ('_old_id', None),
            'eri_application_id': ('varchar', 50),
            'applicant_id_eri': ('ref:applicants', None),
            'info_source': ('varchar', 100),
            'banded': ('boolean', None),
            'band_number': ('varchar', 100),
            'permit_id': ('integer', None),
            'parrot_status': ('varchar', 50),
            'end_date': ('date', None),
            'range': ('ref:ranges', None),
            'has_parrot': ('boolean', None),
            'why_no_parrot': ('text', None),
            'when_no_parrot': ('text', None),
            'where_no_parrot': ('text', None),
            'date_parrot_loss_info_provided': ('date', None),
            'new_owner': ('varchar', 100),
            'new_owner_address': ('varchar', 255),
            'new_owner_contact': ('varchar', 20),
            'species_descrip_by_applicant': ('text', None),
            'species_id': ('integer', None),
            'parrot_picture': ('text', None),
            'period_of_ownership': ('text', None),
            'period_of_ownership_months': ('integer', None),
            'date_period_provided': ('date', None),
            'method_obtained': ('varchar', 100),
            'town_obtained': ('varchar', 100),
            'district_obtain': ('varchar', 100),
            'pet_name': ('varchar', 100),
            'sex': ('varchar', 20),
            'justification_sex_by_applicant': ('text', None),
            'parrot_age_description': ('text', None),
            'parrot_age_months': ('integer', None),
            'date_parrot_age_described': ('date', None),
            'is_healthy': ('boolean', None),
            'health_comments': ('text', None),
            'health_comms_by_professional': ('text', None),
            'stories': ('text', None),
            'bird_comments': ('text', None),
        },
    },
    'Permits.csv': {
        'table': 'permits',
        'columns': {
            'permit_number': ('varchar', 100),
            'id': ('_old_id', None),
            'info_source': ('varchar', 100),
            'applicant_id_eri': ('ref:applicants', None),
            'applicant_id': ('_old_fk', None),
            'status': ('varchar', 50),
            'picture_url': ('text', None),
            'range': ('ref:ranges', None),
            'reference_number': ('varchar', 100),
            'issue_date': ('date', None),
            'housing': ('text', None),
            'number_of_pets': ('integer', None),
            'permit_comments': ('text', None),
        },
    },
    'Preconditions.csv': {
        'table': 'inspections',
        'columns': {
            'eri_inspection_id': ('varchar', 50),
            'eri_preconditions_id': ('varchar', 50),
            'officer_id_eri': ('ref:users', None),
            'applicant_id_eri': ('ref:applicants', None),
            'inspection_date': ('date', None),
            'approx_report_date': ('date', None),
            'when_approx_report_date_provided': ('date', None),
            'birds_described': ('text', None),
            'hand_tame': ('boolean', None),
            'date_acquired': ('date', None),
            'approx_date_acquired': ('varchar', 100),
            'less_12_months_acquired': ('boolean', None),
            'instructions_for_applicant': ('text', None),
            'expected_recheck': ('date', None),
            'preconditions_comments': ('text', None),
        },
    },
}

DATE_RE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
errors = []
warnings = []

for f in sorted(os.listdir(ready)):
    if not f.endswith('.csv'):
        continue
    if f not in schema:
        errors.append(f'[{f}] No schema mapping defined!')
        continue

    path = os.path.join(ready, f)
    spec = schema[f]
    table = spec['table']
    expected_cols = spec['columns']

    with open(path, 'r', encoding='utf-8') as fh:
        rows = list(csv.reader(fh))

    header = rows[0]
    data = rows[1:]

    print(f'=== {f} -> {table} ({len(data)} rows, {len(header)} cols) ===')

    # 1. Check for CSV columns not in schema
    for col in header:
        if col not in expected_cols:
            errors.append(f'[{f}] Column "{col}" exists in CSV but has no schema mapping')

    # 2. Check for schema columns not in CSV (excluding auto-gen and optional)
    for col in expected_cols:
        if col not in header:
            warnings.append(f'[{f}] Schema column "{col}" not present in CSV (will use DB default)')

    # 3. Validate data types for each cell
    type_errors = {}
    length_errors = {}
    for row_idx, row in enumerate(data):
        for col_idx, col in enumerate(header):
            if col not in expected_cols:
                continue
            val = row[col_idx] if col_idx < len(row) else ''
            if val == 'NULL':
                continue  # NULL is fine for any type

            col_type, max_len = expected_cols[col]

            # Skip reference and old ID columns for type validation
            if col_type.startswith('ref:') or col_type.startswith('_'):
                continue

            if col_type == 'boolean':
                if val not in ('true', 'false'):
                    key = (f, col, 'boolean', val)
                    type_errors[key] = type_errors.get(key, 0) + 1

            elif col_type == 'date':
                if not DATE_RE.match(val):
                    key = (f, col, 'date', val[:40])
                    type_errors[key] = type_errors.get(key, 0) + 1

            elif col_type == 'integer':
                try:
                    int(val)
                except ValueError:
                    key = (f, col, 'integer', val[:40])
                    type_errors[key] = type_errors.get(key, 0) + 1

            elif col_type == 'varchar' and max_len:
                if len(val) > max_len:
                    key = (f, col, f'varchar({max_len})')
                    if key not in length_errors:
                        length_errors[key] = (0, 0, val[:80])
                    count, worst, sample = length_errors[key]
                    length_errors[key] = (count + 1, max(worst, len(val)), sample)

    for (file, col, expected, val), count in sorted(type_errors.items()):
        errors.append(f'[{file}] "{col}": {count} value(s) invalid for {expected} (e.g. "{val}")')

    for (file, col, vtype), (count, worst, sample) in sorted(length_errors.items()):
        errors.append(f'[{file}] "{col}": {count} value(s) exceed {vtype} (max found: {worst} chars, e.g. "{sample}")')

    print(f'  Checked {len(data)} rows')
    print()

print('\n========== RESULTS ==========\n')

if errors:
    print(f'ERRORS ({len(errors)}):')
    for e in errors:
        print(f'  !! {e}')
else:
    print('NO ERRORS')

print()

if warnings:
    print(f'WARNINGS ({len(warnings)}):')
    for w in warnings:
        print(f'  >> {w}')
else:
    print('NO WARNINGS')
