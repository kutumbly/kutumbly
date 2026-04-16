import sys
import os

NEW_KEYS = {
    # App Navigation
    "NAV_HOME": { "en": "Home", "hi": "होम", "bho": "घर" },
    "NAV_DIARY": { "en": "Diary", "hi": "डायरी", "bho": "डायरी" },
    "NAV_TASKS": { "en": "Tasks", "hi": "कार्य", "bho": "काज-काम" },
    "NAV_MONEY": { "en": "Money", "hi": "धन", "bho": "रुपिया-पइसा" },
    "NAV_NEVATA": { "en": "Nevata", "hi": "नेवता", "bho": "नेवता" },
    "NAV_HEALTH": { "en": "Health", "hi": "स्वास्थ्य", "bho": "सेहत" },
    "NAV_INVEST": { "en": "Invest", "hi": "निवेश", "bho": "निवेश" },
    "NAV_GROCERY": { "en": "Grocery", "hi": "किराना", "bho": "किराना" },
    "NAV_STAFF": { "en": "Staff", "hi": "स्टाफ", "bho": "स्टाफ" },
    "NAV_VIDYA": { "en": "Vidya", "hi": "विद्या", "bho": "विद्या" },
    "NAV_SYNC": { "en": "Sync", "hi": "सिंक", "bho": "सिंक" },
    "NAV_NETWORK": { "en": "Network", "hi": "नेटवर्क", "bho": "नेटवर्क" },
    "NAV_SETUP": { "en": "Setup", "hi": "सेटअप", "bho": "सेटअप" },

    # Dashboard
    "GREETING": { "en": "Jai Hind", "hi": "जय हिंद", "bho": "जय हिंद" },
    "MONTHLY_BALANCE": { "en": "Monthly Balance", "hi": "मासिक शेष", "bho": "महिना के बचत" },
    "TASKS_DUE": { "en": "Tasks Due", "hi": "नियत कार्य", "bho": "बाकी काम" },
    "LATEST_BP": { "en": "Latest BP", "hi": "नवीनतम बीपी", "bho": "बीपी चेक" },
    "EXPENSES": { "en": "Expenses", "hi": "खर्च", "bho": "खर्चा" },
    "MORE": { "en": "More", "hi": "अधिक", "bho": "अउरी" },

    # Security
    "OFFLINE": { "en": "Offline", "hi": "ऑफलाइन", "bho": "ऑफलाइन" },
    "AES_256": { "en": "AES-256", "hi": "AES-256", "bho": "AES-256" },
    "OS_SECURITY": { "en": "OS Security", "hi": "ओएस सुरक्षा", "bho": "ओएस सुरक्षा" },
    "OS_LOCKDOWN": { "en": "OS Lockdown", "hi": "ओएस लॉकडाउन", "bho": "ओएस लॉकडाउन" },
    "BIOMETRIC": { "en": "Biometric", "hi": "बायोमेट्रिक", "bho": "बायोमेट्रिक" },
    "PIN_REQUIRED": { "en": "PIN Required", "hi": "पिन आवश्यक", "bho": "पिन चाहीं" },

    # Gateway
    "FIND_VAULT_TITLE": { "en": "Find Your Vault", "hi": "अपना वॉल्ट खोजें", "bho": "अपना तिजोरी खोजीं" },
    "EMAIL_DISCOVERY_SUB": { "en": "Enter your encrypted identity", "hi": "अपनी एन्क्रिप्टेड पहचान दर्ज करें", "bho": "आपन पँचान डारीं" },
    "OR_SKIP": { "en": "or skip to setup", "hi": "या सेटअप पर जाएँ", "bho": "भा सेटअप पर जाईं" },
    "CREATE_VAULT": { "en": "Create Local Vault", "hi": "लोकल वॉल्ट बनाएं", "bho": "लोकल तिजोरी बनाईं" },
    "LOCAL": { "en": "Local", "hi": "लोकल", "bho": "लोकल" },

    # Sync
    "SYNC_GRID": { "en": "Sync Grid", "hi": "सिंक ग्रिड", "bho": "सिंक ग्रिड" },
    "LOCAL_DISCOVERY": { "en": "Local Discovery", "hi": "स्थानीय खोज", "bho": "लोकल खोज" },
    "SOVEREIGN_ACTIVITY": { "en": "Sovereign Activity", "hi": "सॉवरेन गतिविधि", "bho": "सॉवरेन काम-काज" },
    "SYNC_NOW": { "en": "Sync Now", "hi": "अभी सिंक करें", "bho": "अभी सिंक करीं" },
    "P2P_BEAM_GRID": { "en": "P2P Beam Grid", "hi": "P2P बीम ग्रिड", "bho": "P2P बीम ग्रिड" },
}

FILE_PATH = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

def apply_updates():
    if not os.path.exists(FILE_PATH):
        print(f"Error: {FILE_PATH} not found.")
        return

    with open(FILE_PATH, 'rb') as f:
        content = f.read().decode('utf-8')

    # Find the DICTIONARY block
    dict_start = content.find('const DICTIONARY')
    if dict_start == -1:
        print("Error: Could not find DICTIONARY definition.")
        return

    # Find the FIRST }; after const DICTIONARY
    dict_end_idx = content.find('};', dict_start)
    if dict_end_idx == -1:
        print("Error: Could not find end of DICTIONARY object.")
        return

    # Find the last closing brace BEFORE this end of DICTIONARY
    last_entry_end = content.rfind('}', dict_start, dict_end_idx)
    if last_entry_end == -1:
        print("Error: Could not find last dictionary entry.")
        return

    # Check for missing comma on the last entry
    after_last_entry = content[last_entry_end+1:dict_end_idx].strip()
    prefix = ""
    if not after_last_entry.startswith(','):
        prefix = ",\n"
    else:
        prefix = "\n"

    new_content_parts = []
    for key, values in NEW_KEYS.items():
        val_str = ", ".join([f'{lang}: "{txt}"' for lang, txt in values.items()])
        full_entry = '  "{0}": {{ {1} }},'.format(key, val_str)
        new_content_parts.append(full_entry)

    insertion_point = last_entry_end + 1
    if after_last_entry.startswith(','):
        insertion_point = content.find(',', last_entry_end) + 1

    updated_content = (
        content[:insertion_point].rstrip() + 
        prefix + 
        "\n".join(new_content_parts) + 
        "\n" + 
        content[dict_end_idx:]
    )

    updated_content = updated_content.replace('\r\n', '\n')

    with open(FILE_PATH, 'wb') as f:
        f.write(updated_content.encode('utf-8'))

    print(f"Successfully applied {len(NEW_KEYS)} updates to i18n.ts (v4)")

if __name__ == "__main__":
    apply_updates()
