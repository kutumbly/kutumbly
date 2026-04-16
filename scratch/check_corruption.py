import sys

with open(r'd:\IMP\GitHub\kutumbly\lib\i18n.ts', 'rb') as f:
    content = f.read()

# Check for null bytes
if b'\x00' in content:
    print("Found NULL bytes in file!")
    indices = [i for i, b in enumerate(content) if b == 0]
    print(f"Indices of NULL bytes: {indices[:20]}...")
else:
    print("No NULL bytes found.")

# Try to decode as UTF-8 and see where it fails or if it's weird
try:
    text = content.decode('utf-8')
    print("Successfully decoded as UTF-8.")
    
    # Check for specific mangled pattern around "મિશન વિહંગા"
    if "મિશન વિહંગા" in text:
        idx = text.find("મિશન વિહંગા")
        print(f"Snippet at મિશન વિહંગા: {text[idx:idx+100]!r}")
except Exception as e:
    print(f"UTF-8 Decoding error: {e}")
