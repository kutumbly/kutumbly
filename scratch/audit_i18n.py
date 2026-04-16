# audit_i18n.py - Deep audit of lib/i18n.ts integrity
import re
from collections import Counter

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(i18n_file, 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.splitlines()

print(f"Total lines: {len(lines)}")
print(f"Total bytes: {len(content.encode('utf-8'))}")
print()

# --- Extract keys ---
all_keys = re.findall(r'^\s*"([\w.]+)"\s*:', content, re.MULTILINE)
print(f"Total keys found: {len(all_keys)}")

# --- Duplicate detection ---
counter = Counter(all_keys)
dupes = {k: v for k, v in counter.items() if v > 1}
if dupes:
    print(f"\nDUPLICATE KEYS ({len(dupes)}):")
    for k, v in sorted(dupes.items()):
        print(f"  {k!r} x{v}")
else:
    print("No duplicate keys. CLEAN.")

# --- DICTIONARY boundaries ---
dict_start = None
dict_end = None
in_dict = False
for i, line in enumerate(lines):
    if 'export const DICTIONARY' in line:
        dict_start = i
        in_dict = True
    elif in_dict and line.strip() == '};':
        dict_end = i
        break

print(f"\nDICTIONARY: lines {dict_start+1} to {dict_end+1}")

# --- Extract keys INSIDE dictionary only ---
dict_content = '\n'.join(lines[dict_start:dict_end])
dict_keys = re.findall(r'^\s*"([\w.]+)"\s*:', dict_content, re.MULTILINE)
print(f"Keys inside DICTIONARY: {len(dict_keys)}")

# --- Check all 12 languages per entry ---
lang_order = ["en", "hi", "mr", "gu", "pa", "ta", "bho", "kn", "te", "ne", "bn", "mni"]
entries_missing_langs = []
entry_pattern = re.compile(r'"([\w.]+)"\s*:\s*\{([^}]+)\}', re.DOTALL)
for m in entry_pattern.finditer(dict_content):
    key = m.group(1)
    body = m.group(2)
    present = re.findall(r'\b(en|hi|mr|gu|pa|ta|bho|kn|te|ne|bn|mni)\s*:', body)
    missing = [l for l in lang_order if l not in present]
    if missing:
        entries_missing_langs.append((key, missing))

if entries_missing_langs:
    print(f"\nEntries with MISSING language fields ({len(entries_missing_langs)}):")
    for key, missing in entries_missing_langs[:20]:
        print(f"  {key!r}: missing {missing}")
    if len(entries_missing_langs) > 20:
        print(f"  ... and {len(entries_missing_langs)-20} more")
else:
    print("All entries have all 12 languages. CLEAN.")

# --- useTranslation structure check ---
ut_start = None
ut_end = None
for i, line in enumerate(lines):
    if 'export const useTranslation' in line:
        ut_start = i
    if ut_start and i > ut_start and line.strip() == '};':
        ut_end = i
        break

print(f"\nuseTranslation: lines {ut_start+1 if ut_start else '?'} to {ut_end+1 if ut_end else '?'}")
if ut_start and ut_end:
    ut_body = lines[ut_start:ut_end+1]
    print(f"  Body ({len(ut_body)} lines):")
    for l in ut_body:
        print(f"    {l}")

# --- Check for stray key definitions outside DICTIONARY ---
post_dict = '\n'.join(lines[dict_end+1:])
stray = re.findall(r'^\s*"([\w.]+)"\s*:\s*\{', post_dict, re.MULTILINE)
if stray:
    print(f"\nSTRAY KEY DEFINITIONS outside DICTIONARY ({len(stray)}): {stray[:5]}")
else:
    print("\nNo stray key definitions outside DICTIONARY. CLEAN.")

print("\n=== Audit complete ===")
