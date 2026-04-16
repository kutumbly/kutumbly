# verify_step_indicator.py
import re

with open(r'd:\IMP\GitHub\kutumbly\lib\i18n.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the STEP_INDICATOR line directly
for line in content.splitlines():
    if 'STEP_INDICATOR' in line:
        langs = re.findall(r'\b(en|hi|mr|gu|pa|ta|bho|kn|te|ne|bn|mni)\s*:', line)
        print('STEP_INDICATOR languages present:', sorted(set(langs)))
        print('Count:', len(set(langs)))
        print('Line preview:', line[:200])
        break
