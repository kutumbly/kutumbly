# fix_bho_strings.py
# 1. Replace "हऽ" → "हवे" and "राउर" → "आपन" in bho fields of DICTIONARY
# 2. Report all bho field values that contain non-Devanagari (Latin/English) words

import re

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(i18n_file, 'r', encoding='utf-8') as f:
    content = f.read()

original = content

# ── Step 1: Targeted replacement ONLY inside bho: "..." values ──────────────
# Match bho: "..." or bho: '...' patterns and replace within them

def fix_bho_field(m):
    val = m.group(0)
    val = val.replace('हऽ', 'हवे')
    val = val.replace('राउर', 'आपन')
    return val

# Match bho field: bho: "anything until next language key or }"
# Pattern: bho: "..." — handles both quoted styles
bho_pattern = re.compile(r'bho:\s*"[^"]*"')
new_content = bho_pattern.sub(fix_bho_field, content)

# Count replacements
ha_count = content.count('हऽ') - new_content.count('हऽ')
raur_count = content.count('राउर') - new_content.count('राउर')
print(f'Replaced ha-half (wrongform) to have: {ha_count} times')
print(f'Replaced raur to aapan: {raur_count} times')

# ── Step 2: Find bho values containing English/Latin characters ─────────────
print('\n-- bho values with mixed/English content --')
mixed = []
for m in bho_pattern.finditer(new_content):
    val = m.group(0)
    # Check for Latin alphabet presence
    if re.search(r'[a-zA-Z]', val):
        mixed.append(val)

if mixed:
    for v in mixed:
        try:
            print(f'  MIXED: {v[:120]}')
        except UnicodeEncodeError:
            print(f'  MIXED: [key with non-ASCII bho value - len={len(v)}]')
else:
    print('  No mixed-language bho values found.')

# ── Step 3: Write file ───────────────────────────────────────────────────────
if new_content != original:
    with open(i18n_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('\nFile updated successfully.')
else:
    print('\nNo changes needed.')
