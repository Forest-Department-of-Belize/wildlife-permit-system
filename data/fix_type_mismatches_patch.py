import csv

# Fix the 3 values that were incorrectly extracted:
# "2 0r 3" -> should be 2 (not 0 from "0r")
# "2024-02-04 00:00:00" -> should be NULL (it's a date, not a neighbor count)

path = 'data/ready/Calls.csv'
with open(path, 'r', encoding='utf-8') as f:
    rows = list(csv.reader(f))
header = rows[0]
data = rows[1:]
ci = header.index('num_neighbors_parrots')

# "2 0r 3" was converted to 0, should be 2
# "2024-02-04..." was converted to 0, should be NULL
# Find them: they're the rows with value "0" that were just changed
# We need to re-check from original source to be precise

# Read original source to find the actual values
orig_map = {}
with open('data/csv/Parrot_Data_Deliverable_UBERI__Calls.csv', 'r', encoding='utf-8') as f:
    orig_rows = list(csv.reader(f))
orig_header = orig_rows[0]
orig_ci = orig_header.index('num_neighbors_parrots')
orig_eri = orig_header.index('call_id_eri')

for r in orig_rows[1:]:
    if orig_ci < len(r):
        v = r[orig_ci].strip()
        if v in ('2 0r 3', '2024-02-04 00:00:00'):
            orig_map[r[orig_eri]] = v

# Find matching rows in ready CSV
eri_ci = header.index('eri_call_id')
fixed = 0
for r in data:
    eri = r[eri_ci]
    if eri in orig_map:
        orig_val = orig_map[eri]
        if orig_val == '2 0r 3':
            print(f'  {eri}: "2 0r 3" -> 2 (lowest meaningful integer)')
            r[ci] = '2'
            fixed += 1
        elif orig_val == '2024-02-04 00:00:00':
            print(f'  {eri}: "2024-02-04 00:00:00" -> NULL (date, not a count)')
            r[ci] = 'NULL'
            fixed += 1

print(f'Patched {fixed} values')

with open(path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data)
