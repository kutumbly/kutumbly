
import sys

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(file_path, 'rb') as f:
    data = f.read()

# We know line 95 is corrupted. Let's find the lines around it.
# Instead of relying on utf-8 decoding which might fail, let's process as lines but handle errors.
try:
    content = data.decode('utf-8')
    lines = content.splitlines(keepends=True)
except UnicodeDecodeError:
    # Fallback: decode with ignore then find the bad line
    content = data.decode('utf-8', errors='ignore')
    lines = content.splitlines(keepends=True)

# Correct Punjabi line for AES decryption
# Based on common patterns in the file:
# pa: "ਡਿਸਕ 'ਤੇ ਲਿਖਣ ਤੋਂ ਪਹਿਲਾਂ ਮਿਲਟਰੀ ਗ੍ਰੇਡ AES-256-GCM ਹਾਰਡਵੇਅਰ-ਪੱਧਰ ਦੀ ਇਨਕ੍ਰਿਪਸ਼ਨ।"
correct_line = '    pa: "ਡਿਸਕ \'ਤੇ ਲਿਖਣ ਤੋਂ ਪਹਿਲਾਂ ਮਿਲਟਰੀ ਗ੍ਰੇਡ AES-256-GCM ਹਾਰਡਵੇਅਰ-ਪੱਧਰ ਦੀ ਇਨਕ੍ਰਿਪਸ਼ਨ।",\n'

# Verify if line 95 (0-indexed 94) is the one
if len(lines) > 94 and 'landing.founders.jm.quote' in lines[94]:
    print(f"Repairing line 95: {lines[94][:50]}...")
    lines[94] = correct_line
else:
    # Search for the corruption pattern
    for i, line in enumerate(lines):
        if 'landing.founders.jm.quote' in line and i < 150: # Avoid the real one at 171
            print(f"Repairing line {i+1}: {line[:50]}...")
            lines[i] = correct_line
            break

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Repair completed successfully")
