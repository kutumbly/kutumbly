import re

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

replacements = [
    (r'हऽ', 'हवे'),
    (r'नईखे', 'नाही बा'),
    (r'हमनी के', 'हमन के'),
    (r'हमनन के', 'हमन के'),
    (r'राउर', 'आपन'),
    (r'প্রাইবেসি', 'प्राइवेसी'),
    (r'প্রাইবেসী', 'प्राइवेसी'),
    (r'તિજોરી', 'तिजोरी'),
    (r' জরুরত', ' जरूरत'),
    (r' না ', ' नाही '),
    (r' ना।', ' नाही।'),
    (r' ना"', ' नाही"'),
    (r' ना,', ' नाही,'),
    (r'शुरू करीं', 'चालू करीं'),
    (r'शुरू करीं', 'चालू करीं'),
    (r'शुरू કરીं', 'चालू करीं'),
    (r'शुरू કરીं', 'चालू करीं'),
]

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

# Specific one-offs
content = content.replace('हमनी के मिशन अइसन डिजिटल किला बनावल बा जवना के हर परिवार हकदार बा।', 'हमन के मिशन अइसन डिजिटल किला बनावल बा।')
content = content.replace('ओकर हिस्सा बनीं जे प्राइवेसी के पहिला मानत बा।', 'ओकर हिस्सा बनीं जे प्राइवेसी के पहिला मानत हवे।')
content = content.replace('તિજોરી શરૂ કરીं', 'तिजोरी चालू करीं')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Standardization complete.")
