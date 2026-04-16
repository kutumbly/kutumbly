# deep_audit.py - Full codebase i18n usage audit
import os, re

src_dirs = [
    r'd:\IMP\GitHub\kutumbly\app',
    r'd:\IMP\GitHub\kutumbly\components',
    r'd:\IMP\GitHub\kutumbly\lib',
]

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

# Load dictionary keys
with open(i18n_file, 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.splitlines()

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

dict_content = '\n'.join(lines[dict_start:dict_end])
existing_keys = set(re.findall(r'"([\w.]+)"\s*:', dict_content))

# Scan all source files
issues = []
for d in src_dirs:
    for root, _, files in os.walk(d):
        if 'scratch' in root or 'node_modules' in root:
            continue
        for file in files:
            if not file.endswith(('.ts', '.tsx')):
                continue
            fpath = os.path.join(root, file)
            rel = os.path.relpath(fpath, r'd:\IMP\GitHub\kutumbly')
            with open(fpath, 'r', encoding='utf-8') as f:
                try:
                    src = f.read()
                    src_lines = src.splitlines()
                except Exception as e:
                    print(f"Unreadable: {rel}: {e}")
                    continue

            for i, line in enumerate(src_lines, 1):
                # t("KEY") or t('KEY')
                for m in re.finditer(r"\bt\(['\"]([^'\"]+)['\"]\)", line):
                    key = m.group(1)
                    if key not in existing_keys:
                        issues.append(('MISSING_KEY', rel, i, key))

                # .replace('{n}' or similar patterns in t() calls - possible placeholder mismatch
                if "STEP_INDICATOR" in line and "replace" in line:
                    issues.append(('PLACEHOLDER_CHECK', rel, i, line.strip()))

                # t() called with dynamic variable (runtime - can't validate)
                for m in re.finditer(r"\bt\(([^)'\"]+)\)", line):
                    arg = m.group(1).strip()
                    if not arg.startswith(("'", '"')):
                        issues.append(('DYNAMIC_KEY', rel, i, arg))

print("=== DEEP AUDIT RESULTS ===\n")

if not issues:
    print("NO ISSUES FOUND. System is clean.")
else:
    categories = {}
    for kind, rel, lineno, detail in issues:
        categories.setdefault(kind, []).append((rel, lineno, detail))

    for kind, items in categories.items():
        print(f"[{kind}] ({len(items)} occurrences)")
        for rel, lineno, detail in items[:15]:
            print(f"  {rel}:{lineno}  {detail[:100]}")
        if len(items) > 15:
            print(f"  ... and {len(items)-15} more")
        print()

print("=== Done ===")
