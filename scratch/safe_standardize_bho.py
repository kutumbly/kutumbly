
import re
import os

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

# Linguistic Rules
rules = [
    (r'नईखे', 'नाही बा'),
    (r'हऽ', 'हवे'),
    (r'राउर', 'आपन'),
    (r'हमनी के', 'हमन के'),
    (r'हमनन के', 'हमन के'),
    (r'ना।', 'नाही।'),  # Sentence end with period
    (r'ना"', 'नाही"'),  # String end
]

def standardize_bho(text):
    # This regex matches the bho check: bho: "..."
    # We want to replace only inside the quotes of bho: "..."
    
    def replace_func(match):
        content = match.group(2)
        # Apply rules to content
        for pattern, replacement in rules:
            content = re.sub(pattern, replacement, content)
        return f'{match.group(1)}"{content}"'

    # Pattern explanation:
    # (bho:\s*) matches "bho: "
    # "([^"]*)" matches the content inside quotes
    return re.sub(r'(bho:\s*)"([^"]*)"', replace_func, text)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Apply standardization
new_content = standardize_bho(content)

# Safety check: Compare line counts and ensure no obvious corruption like injected keys
if len(new_content.splitlines()) != len(content.splitlines()):
    print("Error: Line count mismatch. Standardizer might have corrupted the file structure.")
    exit(1)

# Check for nested keys corruption pattern we saw before
if '": {' in new_content:
    # Find occurrences that are NOT at the start of a line (roughly)
    lines = new_content.splitlines()
    for i, line in enumerate(lines):
        if line.strip().count('": {') > 1 or (line.strip().count('": {') == 1 and not line.strip().startswith('"')):
             if i > 25: # Skip the DICTIONARY definition line itself if it matches
                print(f"Error: Potential corruption detected at line {i+1}")
                print(f"Content: {line[:100]}...")
                exit(1)

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_content)

print("Bhojpuri Standardization Applied Successfully.")
