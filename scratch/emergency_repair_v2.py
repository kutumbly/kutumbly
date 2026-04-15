
import sys

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(file_path, 'rb') as f:
    data = f.read()

# Reliable split as bytes to avoid encoding issues on mid-line corruption
lines_bytes = data.split(b'\n')

# Key we are looking for is in line 95 (index 94)
# Let's check for the key manually in bytes
target_key = b'pa:'
corruption_marker = b'landing.founders.jm.quote'

found = False
for i, line in enumerate(lines_bytes):
    if target_key in line and corruption_marker in line and i < 150:
        print(f"Repairing corrupted line {i+1}")
        # Punjabi: ਡਿਸਕ 'ਤੇ ਲਿਖਣ ਤੋਂ ਪਹਿਲਾਂ ਮਿਲਟਰੀ ਗ੍ਰੇਡ AES-256-GCM ਹਾਰਡਵੇਅਰ-ਪੱਧਰ ਦੀ ਇਨਕ੍ਰਿਪਸ਼ਨ।
        # We must use the exact bytes or encode strings to utf-8
        new_line = '    pa: "ਡਿਸਕ \'ਤੇ ਲਿਖਣ ਤੋਂ ਪਹਿਲਾਂ ਮਿਲਟਰੀ ਗ੍ਰੇਡ AES-256-GCM ਹਾਰਡਵੇਅਰ-ਪੱਧਰ ਦੀ ਇਨਕ੍ਰਿਪਸ਼ਨ।",'.encode('utf-8')
        lines_bytes[i] = new_line
        found = True
        break

if found:
    with open(file_path, 'wb') as f:
        f.write(b'\n'.join(lines_bytes))
    print("File saved successfully")
else:
    print("Corruption not found by byte pattern")
