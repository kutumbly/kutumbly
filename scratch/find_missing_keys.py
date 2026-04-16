import os
import re

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'
src_dirs = [r'd:\IMP\GitHub\kutumbly\app', r'd:\IMP\GitHub\kutumbly\components', r'd:\IMP\GitHub\kutumbly\lib']

# 1. Get all keys currently in DICTIONARY
existing_keys = set()
with open(i18n_file, 'r', encoding='utf-8') as f:
    in_dict = False
    for line in f:
        if 'export const DICTIONARY' in line:
            in_dict = True
        elif in_dict and line.strip() == '};':
            break
        elif in_dict:
            # Match "KEY": or 'KEY': or KEY:
            match = re.search(r'^\s*[\'"]?([a-zA-Z0-9_\.]+)[\'"]?\s*:', line)
            if match:
                existing_keys.add(match.group(1))

# 2. Extract all keys used in code
used_keys = set()
key_pattern = re.compile(r'\bt\(\s*[\'"]([a-zA-Z0-9_\.]+)[\'"]')

for d in src_dirs:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    try:
                        content = f.read()
                        matches = key_pattern.findall(content)
                        used_keys.update(matches)
                    except Exception as e:
                        print(f"Could not read {filepath}: {e}")

# 3. Find missing keys
missing_keys = used_keys - existing_keys

print(f"Found {len(existing_keys)} existing keys.")
print(f"Found {len(used_keys)} used keys.")
print("-" * 20)
if missing_keys:
    print("MISSING KEYS:")
    for k in sorted(missing_keys):
        print(f"  - {k}")
else:
    print("NO MISSING KEYS FOUND!")
