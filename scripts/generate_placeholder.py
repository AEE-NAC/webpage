import json
import os

# Source of truth
with open('temp/translations/en.json', 'r') as f:
    en_data = json.load(f)

# Existing data (to preserve manual edits)
with open('temp/translations/fr.json', 'r') as f:
    fr_existing = json.load(f)
with open('temp/translations/ht.json', 'r') as f:
    ht_existing = json.load(f)
# es.json is empty

# Metadata helper
def get_meta(lang_code, total_keys):
    meta = en_data['_meta'].copy()
    meta['language'] = lang_code
    meta['total_keys'] = total_keys
    return meta

# Translation Dictionary (English Key -> {fr, es, ht})
# Populated by AI knowledge
translations_map = {
    # Structure: "key": {"fr": "...", "es": "...", "ht": "..."}
    # Note: If 'fr' exists in fr.json, it will be used instead of this.
}

# --- BULK TRANSLATIONS DATA ---
# This section is populated with the translations I generate now.

# Common Terms / Buttons
t_common = {
    "Learn more": {"fr": "En savoir plus", "es": "Saber más", "ht": "Aprann plis"},
    "Read More": {"fr": "Lire la suite", "es": "Leer más", "ht": "Li plis"},
    "Donate": {"fr": "Faire un don", "es": "Donar", "ht": "Fè yon don"},
    "Join Us": {"fr": "Rejoignez-nous", "es": "Únete a nosotros", "ht": "Antre nan nou"},
    "Contact": {"fr": "Contact", "es": "Contacto", "ht": "Kontak"},
    "Home": {"fr": "Accueil", "es": "Inicio", "ht": "Akèy"},
    "About": {"fr": "À propos", "es": "Sobre nosotros", "ht": "Apwopo"},
    "Ministries": {"fr": "Ministères", "es": "Ministerios", "ht": "Ministè yo"},
    "Staff": {"fr": "Notre équipe", "es": "Nuestro equipo", "ht": "Ekip nou an"},
    "Get Involved": {"fr": "Impliquez-vous", "es": "Involúcrate", "ht": "Enplike w"},
    "Our Team": {"fr": "Notre équipe", "es": "Nuestro equipo", "ht": "Ekip nou an"},
    "Back": {"fr": "Retour", "es": "Atrás", "ht": "Retounen"},
    "Submit": {"fr": "Soumettre", "es": "Enviar", "ht": "Soumèt"},
    "Send": {"fr": "Envoyer", "es": "Enviar", "ht": "Voye"},
    "Cancel": {"fr": "Annuler", "es": "Cancelar", "ht": "Anile"},
    "Loading...": {"fr": "Chargement...", "es": "Cargando...", "ht": "Chajman..."},
    "Success": {"fr": "Succès", "es": "Éxito", "ht": "Siksè"},
    "Error": {"fr": "Erreur", "es": "Error", "ht": "Erè"},
    "Name": {"fr": "Nom", "es": "Nombre", "ht": "Non"},
    "Email": {"fr": "Email", "es": "Correo electrónico", "ht": "Imèl"},
    "Phone": {"fr": "Téléphone", "es": "Teléfono", "ht": "Telefòn"},
    "Message": {"fr": "Message", "es": "Mensaje", "ht": "Mesaj"},
    "Country": {"fr": "Pays", "es": "País", "ht": "Peyi"},
    "Address": {"fr": "Adresse", "es": "Dirección", "ht": "Adrès"},
    "City": {"fr": "Ville", "es": "Ciudad", "ht": "Vil"},
    "Zip": {"fr": "Code postal", "es": "Código postal", "ht": "Kòd postal"},
}

# Specific Keys (mapped manually to ensure accuracy)
# Only filling in keys that might be missing or need specific translation
custom_translations = {
    # ABOUT
    "about.header.prefix": {"fr": "Chaque", "es": "Cada", "ht": "Chak"},
    "about.header.roll.word1": {"fr": "enfant", "es": "niño", "ht": "timoun"},
    "about.header.roll.word2": {"fr": "nation", "es": "nación", "ht": "nasyon"},
    "about.header.roll.word3": {"fr": "jour", "es": "día", "ht": "jou"},
    "about.header.subtitle": {
        "fr": "Une mission divine pour atteindre et transformer des vies",
        "es": "Una misión divina para alcanzar y transformar vidas",
        "ht": "Yon misyon diven pou rive ak transfòme lavi yo"
    },
    "about.history.title": {"fr": "Notre Histoire", "es": "Nuestra Historia", "ht": "Istwa Nou"},
    "about.history.person_name": {"fr": "Jesse Irvin Overholtzer", "es": "Jesse Irvin Overholtzer", "ht": "Jesse Irvin Overholtzer"},
    "about.history.p1": {
        "fr": "En 1937, Jesse Irvin Overholtzer, un homme de 60 ans, a fondé l'AEE...",
        "es": "En 1937, Jesse Irvin Overholtzer, un hombre de 60 años, fundó CEF...",
        "ht": "Nan lane 1937, Jesse Irvin Overholtzer, ki te gen 60 an, te fonde CEF..."
    }, # (Full text logic handled in loop below if simple map fails)
    
    # MISSION
    "about.mission.title": {"fr": "Notre Mission", "es": "Nuestra Misión", "ht": "Misyon Nou"},
    "about.mission.content": {
        "fr": "L'Association Évangile pour Enfants est une organisation mondiale...",
        "es": "Child Evangelism Fellowship es una organización bíblica mundial...",
        "ht": "Child Evangelism Fellowship se yon òganizasyon mondyal ki baze sou Bib la..."
    },
    "about.mission.cta": {"fr": "En savoir plus", "es": "Saber más", "ht": "Aprann plis"},

    # ... (I will use a programmatic approach to fill the rest based on the EN value)
}

# --- LOGIC TO GENERATE ALL ---

full_translations = {
    "fr": {},
    "es": {},
    "ht": {}
}

# Load the keys I Identified from previous step and provide translations
# Since I cannot interactively ask, I will implement a robust Translator function here.
# For the purpose of this script, I will hardcode the translations for the identified dictionary.

# HACK: Because the list is huge, I will use a simple heuristic and critical path translations.
# Better approach: I will iterate over EN keys.

for key, obj in en_data.items():
    if key == '_meta': continue
    en_val = obj['value']
    type_ = obj['type']
    
    # 1. Check Existing
    fr_val = fr_existing.get(key, {}).get('value')
    ht_val = ht_existing.get(key, {}).get('value')
    es_val = None # Empty

    # 2. Translate if missing
    # I will define a large dictionary here with the translations I've prepared.
    
    # Dictionary of specific phrases found in en.json
    # This is where I put my AI intelligence to work.
    
    # --- TRANSLATION MEMORY ---
    tm = {
        # Navigation
        "Home": ["Accueil", "Inicio", "Akèy"],
        "About": ["À propos", "Sobre nosotros", "Apwopo"],
        "Contact": ["Contact", "Contacto", "Kontak"],
        "Donate": ["Faire un don", "Donar", "Fè yon don"],
        "Join Us": ["Rejoignez-nous", "Únete a nosotros", "Antre nan nou"],
        "Get Involved": ["Impliquez-vous", "Involúcrate", "Enplike w"],
        "Ministries": ["Ministères", "Ministerios", "Ministè yo"],
        "Our Team": ["Notre équipe", "Nuestro equipo", "Ekip nou an"],
        
        # Common text
        "Learn More": ["En savoir plus", "Saber más", "Aprann plis"],
        "Read More": ["Lire la suite", "Leer más", "Li plis"],
        "See All": ["Voir tout", "Ver todo", "Wè tout"],
        "Back": ["Retour", "Atrás", "Retounen"],
        
        # Specifics
        "Every child": ["Chaque enfant", "Cada niño", "Chak timoun"],
        "Every nation": ["Chaque nation", "Cada nación", "Chak nasyon"],
        "Every day": ["Chaque jour", "Cada día", "Chak jou"],
        "Every Child": ["Chaque Enfant", "Cada Niño", "Chak Timoun"],
        "Every Nation": ["Chaque Nation", "Cada Nación", "Chak Nasyon"],
        "Every Day": ["Chaque Jour", "Cada Día", "Chak Jou"],
        
        "A divine mission to reach and transform lives": [
            "Une mission divine pour atteindre et transformer des vies",
            "Una misión divina para alcanzar y transformar vidas",
            "Yon misyon diven pou rive ak transfòme lavi yo"
        ],
        "Notre Histoire": ["Notre Histoire", "Nuestra Historia", "Istwa Nou"], # Note: Source might be FR? No en.json has "Notre Histoire" as value? Wait. 
        # Checking en.json content from read_file...
        # "about.history.title": { "value": "Notre Histoire", "ref": "Notre Histoire" } -> It seems en.json has French content in it? 
        # Ah, looking at "about.mission.title": "Our Mission". 
        # "about.history.title" value "Notre Histoire" in EN file? That's suspicious. 
        # Wait, let's look at the read_file output again.
        # "about.history.title": { "value": "Notre Histoire", "ref": "Notre Histoire", "type": "text" }
        # It seems some keys in en.json ALREADY have French values? Or maybe the ref IS French?
        # "about.history.p1": val="En 1937...", ref="En 1937..."
        # Okay, if en.json has French content, I should keep it as is for FR, but translate to EN/ES/HT?
        # User said: "The source of truth is temp/translations/en.json".
        # User said: "For every key in en.json... translate the English value from en.json into the target language."
        # IF en.json has "Notre Histoire", then for FR I keep "Notre Histoire". For ES "Nuestra Historia". For HT "Istwa Nou".
        # It seems the "English" file contains some French text. I will treat the `value` in `en.json` as the source text to translate, regardless of what language it looks like.
        
        "Our Mission": ["Notre Mission", "Nuestra Misión", "Misyon Nou"],
        "Our Strategy": ["Notre Stratégie", "Nuestra Estrategia", "Estrateji Nou"], # Note en.json has "Notre Stratégie" at 'about.strategy.title'
        
        "Our Vision": ["Notre Vision", "Nuestra Visión", "Vizyon Nou"],
        
        # Contact
        "Contact Us": ["Contactez-nous", "Contáctenos", "Kontakte nou"],
        "Support": ["Support", "Soporte", "Sipò"],
        "Nom complet": ["Nom complet", "Nombre completo", "Non konplè"], # en.json has "Nom complet"
        
        # Home
        "Empowering Children, Transforming Lives": [
            "Autonomiser les enfants, transformer des vies",
            "Empoderando a los niños, transformando vidas",
            "Balanse Timoun yo, Transfòme Lavi yo"
        ],
        "Welcome to a New Season": [
            "Bienvenue dans une nouvelle saison",
            "Bienvenido a una nueva temporada",
            "Byenvini nan yon nouvo sezon"
        ],
    }

    # Helper for simple lookups
    def translate_simple(text, lang_idx):
        # lang_idx: 0=fr, 1=es, 2=ht
        if text in tm:
            return tm[text][lang_idx]
        return None

    # Processing logic
    # FR
    if not fr_val:
        t = translate_simple(en_val, 0)
        # Fallback to Google Translate simulation (I will cover common patterns)
        if not t:
            if "Mission" in en_val: t = en_val.replace("Mission", "Mission") 
            # ... this is too weak. I'll rely on the manual population below.
            fr_val = en_val # Placeholder if I miss it, but I'll try to catch all.

    # ES
    es_val = translate_simple(en_val, 1)
    if not es_val: es_val = en_val # Placeholder

    # HT
    ht_val = translate_simple(en_val, 2)
    if not ht_val: ht_val = en_val # Placeholder

    # ... This approach above is too manual.
    # I will write the file with all translations I can generate.
    
    pass

# --- REAL IMPLEMENTATION ---
# I'll create a dictionary with all the translations I need. 
# Since I can't put 300 lines of python code easily here without error, 
# I will use a smart function to guess/translate based on keywords and preserve formatting.

def smart_translate(text, target_lang):
    # This function mocks the AI translation capability 
    # In reality, I (the AI) follow the instructions to generate the file.
    # Since I am writing a python script to be executed, the python script itself cannot call an LLM.
    # Therefore, I MUST provide the data in the python script.
    return text

# Wait, I cannot include the full translation model in the python script.
# The user wants ME to do it.
# So I should create the JSON files DIRECTLY using `create_file` with the content I generate in my head.
# I don't need the python script to *generate* the translations if I can just write them.
# The limit is the output size. 300 keys * 3 languages is a lot of JSON.
# I will write 3 separate files using `create_file`.

# I will verify the keys from `en.json` and generate `fr.json`, `es.json`, `ht.json`.

