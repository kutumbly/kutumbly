import sys
import re

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

# Use regex to find keys and their bho values
# Pattern: "key": { ... bho: "value" ... }

non_standard_terms = {
    'NAIKHE': r'\\u0928\\u0908\\u0916\\u0947',
    'HAMNI_KE': r'\\u0939\\u092e\\u0928\\u0940 \\u0915\\u0947',
    'HAS': r'\\u0939\\u093d',
    'RAUR': r'\\u0930\\u093e\\u0909\\u0930',
    'BANI': r'\\u092c\\u093e\\u0928\\u0940',
    'NA_SPACE': r'\\u0928\\u093e '
}

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("Scanning for non-standard Bhojpuri terms (encoded strings)...")
for term_id, pattern in non_standard_terms.items():
    matches = re.findall(pattern, content)
    if matches:
        print(f"Found {len(matches)} occurrences of pattern for {term_id}")

# Find specific keys
keys_to_check = [
    "landing.hero.manifesto",
    "legal.privacy.owner.content"
]

for key in keys_to_check:
    match = re.search(f'"{key}": {{.*?bho: "(.*?)"', content, re.DOTALL)
    if match:
        val = match.group(1)
        print(f"Key {key} bho value contains:")
        if r'\u0939\u093d' in val: print("  - HAS (\u0939\u093d)")
        if r'\u0928\u0908\u0916\u0947' in val: print("  - NAIKHE (\u0928\u0908\u0916\u0947)")
        if r'\u0939\u092e\u0928\u0940 \u0915\u0947' in val: print("  - HAMNI_KE (\u0939\u092e\u0928\u0940 \u0915\u0947)")
