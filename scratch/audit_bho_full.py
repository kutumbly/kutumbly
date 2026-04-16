# audit_bho_full.py
# Extracts ALL bho: "..." values that contain Latin characters
# and shows them with their key names so we can fix them

import re, sys

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(i18n_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all dictionary entries as (key, full_entry_text)
entry_pattern = re.compile(
    r'"([\w.]+)"\s*:\s*\{([^}]+)\}',
    re.DOTALL
)

# Count total and mixed
total = 0
mixed_entries = []

for m in entry_pattern.finditer(content):
    key = m.group(1)
    body = m.group(2)

    # Extract bho value
    bho_m = re.search(r'bho:\s*"([^"]*)"', body)
    if not bho_m:
        continue
    total += 1
    bho_val = bho_m.group(1)

    if re.search(r'[a-zA-Z]', bho_val):
        mixed_entries.append((key, bho_val))

# Write results to file (avoid console encoding issues)
out_file = r'd:\IMP\GitHub\kutumbly\scratch\bho_mixed_keys.txt'
with open(out_file, 'w', encoding='utf-8') as f:
    f.write(f'Total bho entries: {total}\n')
    f.write(f'Entries with Latin/mixed content: {len(mixed_entries)}\n\n')
    for key, val in mixed_entries:
        f.write(f'{key}|{val}\n')

print(f'Total bho entries: {total}')
print(f'Mixed entries written to: {out_file}')
print(f'Count: {len(mixed_entries)}')
