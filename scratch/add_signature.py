import os
import json
from collections import OrderedDict

SIGNATURE_TEXT = """/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */
"""

XML_SIGNATURE = """<!-- ============================================================
  * कुटुंबली — KUTUMBLY SOVEREIGN OS
  * Zero Cloud · Local First · Encrypted · Offline Forever
  * ============================================================
  * System Architect   :  Jawahar R. Mallah
  * Organisation:  AITDL Network — Sovereign Division
  * Project     :  Kutumbly — India's Family OS
  * Contact     :  kutumbly@outlook.com
  * Web         :  kutumbly.com | aitdl.com | aitdl.in
  *
  * © 2026 Kutumbly.com — All Rights Reserved
  * Unauthorized use or distribution is prohibited.
  *
  * "Memory, Not Code."
  * ============================================================ -->
"""

JSON_METADATA = {
    "_kutumbly": {
        "system": "Kutumbly Sovereign OS",
        "architect": "Jawahar R. Mallah",
        "org": "AITDL Network",
        "mission": "Memory, Not Code.",
        "web": "kutumbly.com"
    }
}

EXTENSIONS = ('.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.xml')
EXCLUDE_DIRS = ('node_modules', '.next', '.git', 'dist', '.gemini', 'scratch', 'out')
EXCLUDE_FILES = ('package-lock.json', 'yarn.lock')

def add_to_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f, object_pairs_hook=OrderedDict)
            
        if "_kutumbly" in data:
            print(f"Skipping (already signed JSON): {file_path}")
            return

        # Create new ordered dict with signature at top
        new_data = OrderedDict()
        new_data.update(JSON_METADATA)
        new_data.update(data)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, indent=2)
            print(f"Added signature (JSON): {file_path}")
            
    except Exception as e:
        print(f"Error processing JSON {file_path}: {e}")

def add_to_xml(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "KUTUMBLY SOVEREIGN OS" in content:
            print(f"Skipping (already signed XML): {file_path}")
            return

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(XML_SIGNATURE + "\n" + content)
            print(f"Added signature (XML): {file_path}")
            
    except Exception as e:
        print(f"Error processing XML {file_path}: {e}")

def add_to_code(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "KUTUMBLY SOVEREIGN OS" in content:
            print(f"Skipping (already signed): {file_path}")
            return

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(SIGNATURE_TEXT + "\n" + content)
            print(f"Added signature: {file_path}")
            
    except Exception as e:
        print(f"Error processing code {file_path}: {e}")

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for root, dirs, files in os.walk(root_dir):
        # Skip excluded dirs
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if file in EXCLUDE_FILES:
                continue
                
            file_path = os.path.join(root, file)
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.css')):
                add_to_code(file_path)
            elif file.endswith('.json'):
                add_to_json(file_path)
            elif file.endswith('.xml'):
                add_to_xml(file_path)

if __name__ == "__main__":
    main()
