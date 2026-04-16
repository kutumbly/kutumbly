import sys
import os

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # Fix missing comma after product.cta.btn
    if '"product.cta.btn": {' in line and '}' in line and not line.strip().endswith(','):
        lines[i] = line.replace(' }', ' },').replace('}', '},')
    
    # Fix activity_EMPTY_SUB (it was added by my previous script without quotes and as lowercase)
    if 'activity_EMPTY_SUB:' in line:
        lines[i] = line.replace('activity_EMPTY_SUB:', '"ACTIVITY_EMPTY_SUB":')

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(lines)

print('Successfully fixed syntax errors in i18n.ts.')
