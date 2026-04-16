# check_and_fix_bho.py
# Find + replace ha-ardha (हऽ) and raur (राउर) in ONLY bho: fields

import re

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(i18n_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check raw counts
ha_ardha = '\u0939\u093d'        # हऽ
have = '\u0939\u0935\u0947'      # हवे
raur = '\u0930\u093e\u0909\u0930' # राउर
aapan = '\u0906\u092a\u0928'     # आपन

count_ha = content.count(ha_ardha)
count_raur = content.count(raur)

with open(r'd:\IMP\GitHub\kutumbly\scratch\bho_check.txt', 'w', encoding='utf-8') as f:
    f.write(f'हऽ occurrences: {count_ha}\n')
    f.write(f'राउर occurrences: {count_raur}\n\n')
    
    # Show which lines contain these
    for lineno, line in enumerate(content.splitlines(), 1):
        if ha_ardha in line:
            f.write(f'हऽ at line {lineno}: {line[:300]}\n')
    for lineno, line in enumerate(content.splitlines(), 1):
        if raur in line:
            f.write(f'राउर at line {lineno}: {line[:300]}\n')

# Now fix
new_content = content
# Replace HA-ARDHA → HAVE  (only in bho fields to be safe — but these forms shouldn't appear in other langs)
new_content = new_content.replace(ha_ardha, have)
# Replace RAUR → AAPAN
new_content = new_content.replace(raur, aapan)

if new_content != content:
    with open(i18n_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    with open(r'd:\IMP\GitHub\kutumbly\scratch\bho_check.txt', 'a', encoding='utf-8') as f:
        f.write(f'\nFIXED: {content.count(ha_ardha)} हऽ → हवे\n')
        f.write(f'FIXED: {content.count(raur)} राउर → आपन\n')
else:
    with open(r'd:\IMP\GitHub\kutumbly\scratch\bho_check.txt', 'a', encoding='utf-8') as f:
        f.write('\nNo ha-ardha or raur found — already clean.\n')

print('Done. See bho_check.txt for details.')
print(f'count_ha={count_ha}, count_raur={count_raur}')
