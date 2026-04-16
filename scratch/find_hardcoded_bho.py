# find_hardcoded_bho.py
# Find hardcoded strings in components that bypass i18n when lang='bho'
# These appear as lang === 'bho' ? 'hindi/english string' : ...

import os, re

src_dirs = [
    r'd:\IMP\GitHub\kutumbly\app',
    r'd:\IMP\GitHub\kutumbly\components',
]

results = []

for d in src_dirs:
    for root, _, files in os.walk(d):
        if 'node_modules' in root:
            continue
        for file in files:
            if not file.endswith(('.ts', '.tsx')):
                continue
            fpath = os.path.join(root, file)
            rel = os.path.relpath(fpath, r'd:\IMP\GitHub\kutumbly')
            with open(fpath, 'r', encoding='utf-8') as f:
                try:
                    src = f.read()
                except:
                    continue

            src_lines = src.splitlines()
            for i, line in enumerate(src_lines, 1):
                # Pattern: lang === 'bho' ? 'hardcoded string'
                if "lang === 'bho'" in line or 'lang === "bho"' in line:
                    results.append((rel, i, line.strip()))

out = r'd:\IMP\GitHub\kutumbly\scratch\hardcoded_bho.txt'
with open(out, 'w', encoding='utf-8') as f:
    f.write(f'Hardcoded bho string bypasses: {len(results)}\n\n')
    for rel, lineno, line in results:
        f.write(f'{rel}:{lineno}\n  {line[:200]}\n\n')

print(f'Found {len(results)} hardcoded bho bypasses')
print(f'Written to: {out}')
