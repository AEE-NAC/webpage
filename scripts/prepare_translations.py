import json

# Load files
with open('temp/translations/en.json', 'r') as f:
    en_data = json.load(f)

with open('temp/translations/fr.json', 'r') as f:
    fr_data = json.load(f)

with open('temp/translations/ht.json', 'r') as f:
    ht_data = json.load(f)

# Helper to check if value is a path/url
def is_url_or_path(text):
    if not isinstance(text, str): return False
    return text.startswith('/') or text.startswith('http') or text.startswith('https')

# Prepare output structures
langs = {
    'fr': {'data': fr_data, 'new_data': {}},
    'es': {'data': {}, 'new_data': {}},
    'ht': {'data': ht_data, 'new_data': {}}
}

# Initialize meta for new data
for lang in langs:
    langs[lang]['new_data']['_meta'] = en_data['_meta'].copy()
    langs[lang]['new_data']['_meta']['language'] = lang
    langs[lang]['new_data']['_meta']['total_keys'] = en_data['_meta']['total_keys']

# Process keys
keys_to_translate = []

for key, val_obj in en_data.items():
    if key == '_meta': continue
    
    en_val = val_obj['value']
    ref = val_obj['ref']
    type_ = val_obj['type']

    for lang_code, lang_info in langs.items():
        existing_val = lang_info['data'].get(key)
        
        new_entry = {
            "ref": ref,
            "type": type_
        }

        if existing_val:
            new_entry['value'] = existing_val['value']
        else:
            # Need translation
            if type_ == 'image' or is_url_or_path(en_val):
                 new_entry['value'] = en_val
            else:
                 new_entry['value'] = f"__TRANSLATE_{lang_code}__:{en_val}" # Placeholder
        
        lang_info['new_data'][key] = new_entry

# Print missing translations to be filled by AI
import sys

print("KEYS TO TRANSLATE:")
for lang_code, lang_info in langs.items():
    print(f"\n--- {lang_code} ---")
    for key, val in lang_info['new_data'].items():
        if key == '_meta': continue
        if isinstance(val['value'], str) and val['value'].startswith("__TRANSLATE_"):
             print(f"{key}|{val['value'].replace(f'__TRANSLATE_{lang_code}__:', '')}")
