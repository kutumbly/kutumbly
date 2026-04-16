# fix_key_placement.py
# Moves misplaced keys out of useTranslation and into DICTIONARY

i18n_file = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(i18n_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Strategy:
# 1. Find "  return (key: string) => t(key, lang);" - everything after it
#    until the closing "};" of useTranslation is the misplaced block
# 2. Extract those lines
# 3. Find the line with "};" that closes DICTIONARY (line 378-ish, the one BEFORE "/**")
# 4. Insert extracted lines before that }; - and close useTranslation properly

# Step 1: Find key landmarks
dict_close_line = None   # the "};" that closes DICTIONARY
use_trans_return_line = None  # "return (key: string) => t(key, lang);"
use_trans_close_line = None  # closing "};" of useTranslation

in_dict = False
dict_start = None

for i, line in enumerate(lines):
    stripped = line.strip()
    
    if 'export const DICTIONARY' in line:
        in_dict = True
        dict_start = i
    elif in_dict and stripped == '};':
        # First }; after DICTIONARY open = dict close
        dict_close_line = i
        in_dict = False
    
    if 'export const useTranslation' in line:
        for j in range(i, len(lines)):
            if 'return (key: string) =>' in lines[j]:
                use_trans_return_line = j
                break
    
    if use_trans_return_line and i > use_trans_return_line and stripped == '};':
        use_trans_close_line = i
        break

print(f"DICTIONARY closes at line {dict_close_line + 1}")
print(f"useTranslation return at line {use_trans_return_line + 1}")
print(f"useTranslation close at line {use_trans_close_line + 1}")

# The misplaced keys are between use_trans_return_line+1 and use_trans_close_line-1
# (lines 400 to 619 in the original; use_trans_close_line is the final };)
misplaced_start = use_trans_return_line + 1  # line after return
misplaced_end = use_trans_close_line         # the closing }; of useTranslation

# These lines contain the "// Auto-generated..." comment and all the new keys
misplaced_lines = lines[misplaced_start:misplaced_end]
print(f"Found {len(misplaced_lines)} misplaced lines to move")

# Rebuild the file:
# [0 .. dict_close_line-1] = everything before the dict }; 
# + misplaced_lines
# + dict close "};""
# + [dict_close_line+1 .. use_trans_return_line] = t() function and useTranslation header
# + "  return (key: string) => t(key, lang);\n"
# + "};\n"  (close useTranslation)

new_lines = (
    lines[:dict_close_line] +           # dict body (without closing };)
    misplaced_lines +                    # keys that were misplaced
    [lines[dict_close_line]] +           # }; closes DICTIONARY
    lines[dict_close_line+1:use_trans_return_line+1] +  # t() fn + useTranslation up to return
    ["  };\n"]                           # close useTranslation properly (was missing the })
)

# Actually useTranslation close is handled - let's do it simpler:
# Keep lines 0..dict_close-1, then insert misplaced, then dict };, then rest up to return+1, then };

new_lines = (
    lines[:dict_close_line] +
    misplaced_lines +
    [lines[dict_close_line]] +           # }; closes DICTIONARY
    lines[dict_close_line+1:use_trans_return_line+1] +
    ["};\n"]                             # close useTranslation
)

with open(i18n_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Done. New file has {len(new_lines)} lines.")
