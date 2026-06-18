import csv, os, re

ready = 'data/ready'

# All date columns per CSV that need fixing
date_columns = {
    'Applicants.csv': ['date_of_birth'],
    'Applications.csv': ['application_date', 'applied_previously_date'],
    'Calls.csv': ['call_date', 'call_later_date', 'followup_date'],
    'CompoundOffenses.csv': ['offense_date', 'signed_date'],
    'Comments.csv': ['comment_date'],
    'Parrots.csv': ['end_date', 'date_parrot_loss_info_provided', 'date_period_provided', 'date_parrot_age_described'],
    'Permits.csv': ['issue_date'],
    'Preconditions.csv': ['inspection_date', 'approx_report_date', 'when_approx_report_date_provided', 'date_acquired', 'expected_recheck'],
}

VALID_DATE = re.compile(r'^\d{4}-\d{2}-\d{2}$')

def expand_2digit_year(yy):
    yy = int(yy)
    if yy <= 26:
        return 2000 + yy
    else:
        return 1900 + yy

def try_fix_date(val, col_name=''):
    """Attempt to parse and normalize a date value to YYYY-MM-DD. Returns (fixed_val, action)."""
    original = val
    val = val.strip()

    if val in ('NULL', ''):
        return val, None

    # Already valid
    if VALID_DATE.match(val):
        return val, None

    # "1981- 12-01" -> "1981-12-01" (spaces around hyphen)
    cleaned = re.sub(r'\s*-\s*', '-', val)
    if VALID_DATE.match(cleaned):
        return cleaned, 'space-in-date'

    # DD/MM/YYYY or D/M/YYYY
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', val)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'dd/mm/yyyy'
        else:
            return 'NULL', f'invalid-dmy({val})'

    # DD/MM/YY (2-digit year)
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{2})$', val)
    if m:
        d, mo, yy = int(m.group(1)), int(m.group(2)), m.group(3)
        y = expand_2digit_year(yy)
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'dd/mm/yy'
        else:
            return 'NULL', f'invalid-dmy-2d({val})'

    # Malformed: "1/11.1984" -> try DD/MM.YYYY or D/MM.YYYY
    m = re.match(r'^(\d{1,2})/(\d{1,2})\.(\d{4})$', val)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'malformed-dot'

    # Malformed: "16/021979" or "17/042007" -> DD/MMYYYY
    m = re.match(r'^(\d{2})/(\d{2})(\d{4})$', val)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'malformed-noslash'

    # Malformed: "13/0273" -> DD/MM73 with 2-digit year?
    m = re.match(r'^(\d{2})/(\d{2})(\d{2})$', val)
    if m:
        d, mo, yy = int(m.group(1)), int(m.group(2)), m.group(3)
        y = expand_2digit_year(yy)
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'malformed-noslash-2d'

    # Malformed: "182/1971" -> could be 18/2/1971 (D/M missing leading zero)
    m = re.match(r'^(\d{1,2})(\d)/(\d{4})$', val)
    if m and int(m.group(2)) <= 9:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'malformed-joined-day'

    # Year-only: "2017.0", "2013.0", etc.
    m = re.match(r'^(\d{4})\.0$', val)
    if m:
        y = int(m.group(1))
        if 1900 <= y <= 2100:
            return f'{y:04d}-01-01', 'year-only'

    # Year-only: "2024.0" already handled above; plain "2017"
    m = re.match(r'^(\d{4})$', val)
    if m:
        y = int(m.group(1))
        if 1900 <= y <= 2100:
            return f'{y:04d}-01-01', 'year-only-plain'

    # Incomplete: "10/10/", "17/3/", "26/05/" (missing year)
    m = re.match(r'^(\d{1,2})/(\d{1,2})/$', val)
    if m:
        return 'NULL', f'incomplete-date({val})'

    # Partial: "24/2/1979" (D/M/YYYY with single-digit month)
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', val)
    if m:
        d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= mo <= 12 and 1 <= d <= 31:
            return f'{y:04d}-{mo:02d}-{d:02d}', 'dd/m/yyyy'

    # Everything else: not a date
    return 'NULL', f'garbage({val})'


total_stats = {}

for fname in sorted(os.listdir(ready)):
    if not fname.endswith('.csv') or fname not in date_columns:
        continue

    path = os.path.join(ready, fname)
    with open(path, 'r', encoding='utf-8') as f:
        rows = list(csv.reader(f))

    header = rows[0]
    data = rows[1:]
    cols = date_columns[fname]

    file_stats = {}
    for col in cols:
        if col not in header:
            continue
        ci = header.index(col)
        col_stats = {}
        for r in data:
            if ci >= len(r):
                continue
            fixed, action = try_fix_date(r[ci], col)
            if action:
                col_stats[action] = col_stats.get(action, 0) + 1
                r[ci] = fixed

        if col_stats:
            file_stats[col] = col_stats

    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(data)

    if file_stats:
        print(f'=== {fname} ===')
        for col, stats in file_stats.items():
            total_fixed = sum(v for k, v in stats.items() if not k.startswith('garbage') and not k.startswith('incomplete') and not k.startswith('invalid'))
            total_nulled = sum(v for k, v in stats.items() if k.startswith('garbage') or k.startswith('incomplete') or k.startswith('invalid'))
            print(f'  {col}: {total_fixed} fixed, {total_nulled} -> NULL')
            for action, count in sorted(stats.items()):
                print(f'    {action}: {count}')
        print()
