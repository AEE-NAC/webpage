import json

# EN Data (Source)
en_data = {
  "_meta": { "language": "en", "total_keys": 293 },
  "about.header.bg_image": { "value": "/images/font_3.jpg", "ref": "/images/font_3.jpg", "type": "image" },
  "about.header.prefix": { "value": "Every", "ref": "Every", "type": "text" },
  "about.header.roll.word1": { "value": "child", "ref": "child", "type": "text" },
  "about.header.roll.word2": { "value": "nation", "ref": "nation", "type": "text" },
  "about.header.roll.word3": { "value": "day", "ref": "day", "type": "text" },
  "about.header.subtitle": { "value": "A divine mission to reach and transform lives", "ref": "A divine mission to reach and transform lives", "type": "text" },
  "about.history.image": { "value": "/placeholder.svg?height=500&width=500", "ref": "/placeholder.svg?height=500&width=500", "type": "image" },
  "about.history.p1": { "value": "En 1937, Jesse Irvin Overholtzer, un homme de 60 ans, a fondé Child Evangelism Fellowship (CEF). Ayant grandi dans une famille religieuse, il a compris l'évangile à un jeune âge, mais sa mère lui a dit qu'il était trop jeune pour être sauvé. Plus tard, au collège, il s'est converti, mais il a regretté les années perdues.", "ref": "En 1937, Jesse Irvin Overholtzer, un homme de 60 ans, a fondé Child Evangelism Fellowship (CEF). Ayant grandi dans une famille religieuse, il a compris l'évangile à un jeune âge, mais sa mère lui a dit qu'il était trop jeune pour être sauvé. Plus tard, au collège, il s'est converti, mais il a regretté les années perdues.", "type": "text" },
  "about.history.p2": { "value": "M. Overholtzer a été pasteur pendant plusieurs années, mais la lecture d'un sermon de Charles Spurgeon a changé sa vie. Spurgeon a dit : « Un enfant de 5 ans, s'il est bien instruit, peut croire et être régénéré autant qu'un adulte ».", "ref": "M. Overholtzer a été pasteur pendant plusieurs années, mais la lecture d'un sermon de Charles Spurgeon a changé sa vie. Spurgeon a dit : « Un enfant de 5 ans, s'il est bien instruit, peut croire et être régénéré autant qu'un adulte ».", "type": "text" },
  "about.history.p3": { "value": "Aujourd'hui, l'AEE est présente dans la plupart des pays du monde, poursuivant la vision de son fondateur d'atteindre chaque enfant.", "ref": "Aujourd'hui, l'AEE est présente dans la plupart des pays du monde, poursuivant la vision de son fondateur d'atteindre chaque enfant.", "type": "text" },
  "about.history.person_name": { "value": "Jesse Irvin Overholtzer", "ref": "Jesse Irvin Overholtzer", "type": "text" },
  "about.history.title": { "value": "Notre Histoire", "ref": "Notre Histoire", "type": "text" },
  "about.mission.content": { "value": "Child Evangelism Fellowship is a worldwide Bible-centered organization of born-again believers whose purpose is to evangelize boys and girls with the gospel of the Lord Jesus Christ and to establish them in the word of God and in a local church to live their Christian lives.", "ref": "Child Evangelism Fellowship is a worldwide Bible-centered organization of born-again believers whose purpose is to evangelize boys and girls with the gospel of the Lord Jesus Christ and to establish them in the word of God and in a local church to live their Christian lives.", "type": "text" },
  "about.mission.cta": { "value": "Learn more", "ref": "Learn more", "type": "text" },
  "about.mission.title": { "value": "Our Mission", "ref": "Our Mission", "type": "text" },
  "about.strategy.title": { "value": "Notre Stratégie", "ref": "Notre Stratégie", "type": "text" },
  "about.values.title": { "value": "Nos Valeurs", "ref": "Nos Valeurs", "type": "text" },
  "about.vision.card1.desc": { "value": "Every nation", "ref": "Every nation", "type": "text" },
  "about.vision.card1.title": { "value": "Every child", "ref": "Every child", "type": "text" },
  "about.vision.card2.desc": { "value": "Every nation", "ref": "Every nation", "type": "text" },
  "about.vision.card2.title": { "value": "Every nation", "ref": "Every nation", "type": "text" },
  "about.vision.card3.desc": { "value": "Our Strategy", "ref": "Our Strategy", "type": "text" },
  "about.vision.card3.title": { "value": "Every day", "ref": "Every day", "type": "text" },
  "about.vision.title": { "value": "Our vision", "ref": "Our vision", "type": "text" },
  "contact.back": { "value": "Retour", "ref": "Retour", "type": "text" },
  "contact.form.btn_next": { "value": "Continuer", "ref": "Continuer", "type": "text" },
  "contact.form.btn_send": { "value": "Envoyer le message", "ref": "Envoyer le message", "type": "text" },
  "contact.form.btn_sending": { "value": "Envoi en cours...", "ref": "Envoi en cours...", "type": "text" },
  "contact.form.email_label": { "value": "Email", "ref": "Email", "type": "text" },
  "contact.form.message_label": { "value": "Message", "ref": "Message", "type": "text" },
  "contact.form.name_label": { "value": "Nom complet", "ref": "Nom complet", "type": "text" },
  "contact.form.subtitle": { "value": "Nous sommes là pour vous aider. N'hésitez pas à nous envoyer un message.", "ref": "Nous sommes là pour vous aider. N'hésitez pas à nous envoyer un message.", "type": "text" },
  "contact.form.subtitle.step1": { "value": "Commençons par faire connaissance.", "ref": "Commençons par faire connaissance.", "type": "text" },
}
# Shortened for brevity, I will load the full file in the actual script execution

def get_trans(key, lang):
    # This function provides the translations
    # FR
    if lang == 'fr':
        t = {
            "Every": "Chaque",
            "child": "enfant",
            "nation": "nation",
            "day": "jour",
            "A divine mission to reach and transform lives": "Une mission divine pour atteindre et transformer des vies",
            "Child Evangelism Fellowship is a worldwide Bible-centered organization...": "L'Association Évangile pour Enfants est une organisation mondiale...", # Abbreviated
            "Learn more": "En savoir plus",
            "Our Mission": "Notre Mission",
            "Our vision": "Notre vision",
            "Child Evangelism Fellowship. Evangelizing children with the Word of God.": "Association pour l'évangélisation des enfants. Évangéliser les enfants avec la Parole de Dieu.",
            "CEF": "AEE",
            "CEF Global. All rights reserved.": "AEE Tous droits réservés.",
            "Quick Links": "Liens Rapides",
            "Contact Us": "Contactez-nous",
            "FAQs": "FAQ",
            "Support": "Support",
            "Donate": "Faire un don",
            "Join Us": "Rejoignez-nous",
            "Canada": "Canada",
            "About": "À propos",
            "Contact": "Contact",
            "Get Involved": "Impliquez-vous",
            "Home": "Accueil",
            "Ministries": "Ministères",
            "Our Team": "Notre équipe",
            "Who We Are": "Qui sommes-nous",
            "Empowering Children, Transforming Lives": "Habiliter les enfants, en transformant leur vie",
            "Becoming a Volunteer": "Devenir bénévole",
            "Join our mission and help us transform the lives of children in every nation, every day.": "Rejoignez notre mission et aidez-nous à transformer la vie des enfants de chaque nation, chaque jour.",
            "Ready to make a difference?": "Prêt à faire la différence ?",
            "A Message from our Director": "Message de notre directeur",
            "Welcome to a New Season": "Bienvenue dans une nouvelle saison",
            "Upcoming Events": "Événements à venir",
            "Featured Articles": "Articles en vedette",
            "Featured Books": "Livres en vedette",
            "Impact Zones": "Zones d'Impact",
            "Children reached last year": "Enfants atteints l'année dernière",
            "Regional Impact": "Impact régional",
            "Children Reached": "Enfants touchés",
            "Goal 2025": "Objectif 2025",
            # ... Add missing
        }
        return t.get(key)

import sys

# Load Real Files
with open('temp/translations/en.json', 'r') as f:
    real_en = json.load(f)
with open('temp/translations/fr.json', 'r') as f:
    real_fr = json.load(f)
with open('temp/translations/ht.json', 'r') as f:
    real_ht = json.load(f)

# output containers
out_fr = {}
out_es = {}
out_ht = {}

# META
def make_meta(lang):
    m = real_en['_meta'].copy()
    m['language'] = lang
    return m

out_fr['_meta'] = make_meta('fr')
out_es['_meta'] = make_meta('es')
out_ht['_meta'] = make_meta('ht')

# Iterate and Translate
for k, v in real_en.items():
    if k == '_meta': continue
    
    val, ref, typ = v['value'], v['ref'], v['type']
    
    # FR
    if k in real_fr:
        out_fr[k] = real_fr[k]
    else:
        # Translate val to FR
        # If it's French already (detected by common words or existing keys), keep it
        if "Notre Histoire" in val or "En 1937" in val or "Retour" in val:
             out_fr[k] = { "value": val, "ref": ref, "type": typ }
        else:
             # Basic dictionary substitution for common terms
             trans = val
             if val == "Every": trans = "Chaque"
             elif val == "child": trans = "enfant"
             elif val == "nation": trans = "nation"
             elif val == "day": trans = "jour"
             elif val == "Every child": trans = "Chaque enfant"
             elif val == "Every nation": trans = "Chaque nation"
             elif val == "Every day": trans = "Chaque jour"
             elif val == "Every Child": trans = "Chaque Enfant"
             elif val == "Every Nation": trans = "Chaque Nation"
             elif val == "Every Day": trans = "Chaque Jour"
             elif val == "Our Mission": trans = "Notre Mission"
             elif val == "Our Team": trans = "Notre équipe"
             elif val == "Contact Us": trans = "Contactez-nous"
             elif val == "Support": trans = "Support"
             elif val == "Donate": trans = "Faire un don"
             elif val == "Join Us": trans = "Rejoignez-nous"
             elif val == "Quick Links": trans = "Liens Rapides"
             elif val == "Learn more": trans = "En savoir plus"
             elif val == "Read More": trans = "Lire la suite"
             elif val == "See All": trans = "Voir tout"
             elif val == "Home": trans = "Accueil"
             elif val == "About": trans = "À propos"
             elif val == "Contact": trans = "Contact"
             elif val == "Ministries": trans = "Ministères"
             elif val == "Upcoming Events": trans = "Événements à venir"
             elif val == "Featured Articles": trans = "Articles en vedette"
             elif val == "Specific Needs": trans = "Besoins Spécifiques"
             elif val == "Regional Impact": trans = "Impact Régional"
             elif val == "News & Updates": trans = "Nouvelles et Mises à Jour"
             elif val == "Newsletter Archive": trans = "Archives de la Newsletter"
             elif val == "What People Say": trans = "Témoignages"
             elif val == "Training & Formation": trans = "Formation"
             elif val == "Weekly Word": trans = "Parole de la Semaine"
             elif val == "Weekly Words": trans = "Paroles de la Semaine"
             elif val == "Word of the Week": trans = "Mot de la Semaine"
             elif val == "Impact Zones": trans = "Zones d'Impact"
             elif val == "Children Reached": trans = "Enfants Touchés"
             elif val == "Goal 2025": trans = "Objectif 2025"
             elif typ == 'image' or val.startswith('/'): trans = val
             elif val == "Learn More": trans = "En savoir plus"
             elif val == "A divine mission to reach and transform lives": trans = "Une mission divine pour atteindre et transformer des vies"
             
             out_fr[k] = { "value": trans, "ref": ref, "type": typ }

    # ES
    # Always translate val (which might be English or French) to Spanish
    # If val is French: "Retour" -> "Volver", "Notre Histoire" -> "Nuestra Historia"
    # If val is English: "Back" -> "Volver", "Our History" -> "Nuestra Historia"
    trans_es = val
    if typ == 'image' or val.startswith('/') or val.startswith('http'):
        trans_es = val
    else:
        # Common dict
        if val in ["Every", "Chaque"]: trans_es = "Cada"
        elif val == "A divine mission to reach and transform lives": trans_es = "Una misión divina para alcanzar y transformar vidas"
        elif val in ["child", "enfant"]: trans_es = "niño"
        elif val in ["nation"]: trans_es = "nación"
        elif val in ["day", "jour"]: trans_es = "día"
        elif val in ["Every child", "Chaque enfant"]: trans_es = "Cada niño"
        elif val in ["Every nation", "Chaque nation"]: trans_es = "Cada nación"
        elif val in ["Every day", "Chaque jour"]: trans_es = "Cada día"
        elif val in ["Every Child"]: trans_es = "Cada Niño"
        elif val in ["Every Day"]: trans_es = "Cada Día"
        elif val in ["Every Nation"]: trans_es = "Cada Nación"
        elif val in ["Our Mission", "Notre Mission"]: trans_es = "Nuestra Misión"
        elif val in ["Our Team", "Notre équipe"]: trans_es = "Nuestro Equipo"
        elif val in ["Contact Us", "Contactez-nous"]: trans_es = "Contáctenos"
        elif val in ["Support"]: trans_es = "Soporte"
        elif val in ["Donate", "Faire un don"]: trans_es = "Donar"
        elif val in ["Join Us", "Rejoignez-nous"]: trans_es = "Únete"
        elif val in ["Quick Links"]: trans_es = "Enlaces Rápidos"
        elif val in ["Learn more", "En savoir plus"]: trans_es = "Saber más"
        elif val in ["Read More", "Lire la suite"]: trans_es = "Leer más"
        elif val in ["See All", "Voir tout"]: trans_es = "Ver todo"
        elif val in ["Home", "Accueil"]: trans_es = "Inicio"
        elif val in ["About", "À propos"]: trans_es = "Acerca de"
        elif val in ["Contact"]: trans_es = "Contacto"
        elif val in ["Ministries", "Ministères"]: trans_es = "Ministerios"
        elif val in ["Upcoming Events", "Événements à venir"]: trans_es = "Próximos Eventos"
        elif val in ["Featured Articles", "Articles en vedette"]: trans_es = "Artículos Destacados"
        elif val in ["Regional Impact", "Impact régional"]: trans_es = "Impacto Regional"
        elif val in ["News & Updates", "Nouvelles et mises à jour"]: trans_es = "Noticias y Actualizaciones"
        elif val in ["Newsletter Archive"]: trans_es = "Archivo de Boletines"
        elif val in ["What People Say", "Ce que disent les gens"]: trans_es = "Testimonios"
        elif val in ["Training & Formation", "Formations"]: trans_es = "Formación"
        elif val in ["Weekly Word", "Mot de la semaine"]: trans_es = "Palabra Semanal"
        elif val in ["Weekly Words", "Mots hebdomadaires"]: trans_es = "Palabras Semanales"
        elif val in ["Impact Zones"]: trans_es = "Zonas de Impacto"
        elif val in ["Children Reached", "Enfants touchés"]: trans_es = "Niños Alcanzados"
        elif val in ["Goal 2025", "Objectif 2026"]: trans_es = "Meta 2025"
        elif val in ["Retour", "Back"]: trans_es = "Volver"
        elif val in ["Nom", "Name"]: trans_es = "Nombre"
        elif val in ["Nom complet", "Full Name"]: trans_es = "Nombre completo"
        elif val in ["Email"]: trans_es = "Correo electrónico"
        elif val in ["Message"]: trans_es = "Mensaje"
        elif val in ["Téléphone", "Phone"]: trans_es = "Teléfono"
        elif val in ["Adresse", "Address"]: trans_es = "Dirección"
        elif val in ["Pays", "Country"]: trans_es = "País"
        elif val in ["Continuer", "Continue"]: trans_es = "Continuar"
        elif val in ["Envoyer", "Send"]: trans_es = "Enviar"
        elif val in ["Annuler", "Cancel"]: trans_es = "Cancelar"
        elif val in ["Valider", "Submit"]: trans_es = "Enviar"
        elif val == "Notre Histoire": trans_es = "Nuestra Historia"
        elif val == "Notre Stratégie": trans_es = "Nuestra Estrategia"
        elif val == "Nos Valeurs": trans_es = "Nuestros Valores"
        elif "Association pour l'Évangélisation des Enfants" in val: trans_es = "Compañerismo de Evangelismo Infantil"
        elif "AEE" in val: trans_es = "CEF" 
        
    out_es[k] = { "value": trans_es, "ref": ref, "type": typ }

    # HT
    # Map to Haitian Creole
    trans_ht = val
    if typ == 'image' or val.startswith('/') or val.startswith('http'):
        trans_ht = val
    else:
        if val in ["Every", "Chaque"]: trans_ht = "Chak"
        elif val == "A divine mission to reach and transform lives": trans_ht = "Yon misyon diven pou rive ak transfòme lavi yo"
        elif val in ["child", "enfant"]: trans_ht = "timoun"
        elif val in ["nation"]: trans_ht = "nasyon"
        elif val in ["day", "jour"]: trans_ht = "jou"
        elif val in ["Every child", "Chaque enfant"]: trans_ht = "Chak timoun"
        elif val in ["Every nation", "Chaque nation"]: trans_ht = "Chak nasyon"
        elif val in ["Every day", "Chaque jour"]: trans_ht = "Chak jou"
        elif val in ["Every Child"]: trans_ht = "Chak Timoun"
        elif val in ["Every Day"]: trans_ht = "Chak Jou"
        elif val in ["Every Nation"]: trans_ht = "Chak Nasyon"
        elif val in ["Our Mission", "Notre Mission"]: trans_ht = "Misyon Nou"
        elif val in ["Our Team", "Notre équipe"]: trans_ht = "Ekip Nou"
        elif val in ["Contact Us", "Contactez-nous"]: trans_ht = "Kontakte Nou"
        elif val in ["Support"]: trans_ht = "Sipò"
        elif val in ["Donate", "Faire un don"]: trans_ht = "Fè Don"
        elif val in ["Join Us", "Rejoignez-nous"]: trans_ht = "Antre nan Nou"
        elif val in ["Quick Links"]: trans_ht = "Lyen Rapid"
        elif val in ["Learn more", "En savoir plus"]: trans_ht = "Aprann plis"
        elif val in ["Read More", "Lire la suite"]: trans_ht = "Li plis"
        elif val in ["See All", "Voir tout"]: trans_ht = "Wè tout"
        elif val in ["Home", "Accueil"]: trans_ht = "Akèy"
        elif val in ["About", "À propos"]: trans_ht = "Apwopo"
        elif val in ["Contact"]: trans_ht = "Kontak"
        elif val in ["Ministries", "Ministères"]: trans_ht = "Ministè yo"
        elif val in ["Upcoming Events", "Événements à venir"]: trans_ht = "Evènman Kap Vini"
        elif val in ["Featured Articles", "Articles en vedette"]: trans_ht = "Atik Prezante"
        elif val in ["Regional Impact", "Impact régional"]: trans_ht = "Enpak Rejyonal"
        elif val in ["News & Updates", "Nouvelles et mises à jour"]: trans_ht = "Nouvèl ak Mizajou"
        elif val in ["Newsletter Archive"]: trans_ht = "Achiv Bilten"
        elif val in ["What People Say", "Ce que disent les gens"]: trans_ht = "Sa Moun Di"
        elif val in ["Training & Formation", "Formations"]: trans_ht = "Fòmasyon"
        elif val in ["Weekly Word", "Mot de la semaine"]: trans_ht = "Pawòl Semèn nan"
        elif val in ["Weekly Words", "Mots hebdomadaires"]: trans_ht = "Pawòl Chak Semèn"
        elif val in ["Impact Zones"]: trans_ht = "Zòn Enpak"
        elif val in ["Children Reached", "Enfants touchés"]: trans_ht = "Timoun yo Rive"
        elif val in ["Goal 2025", "Objectif 2026"]: trans_ht = "Objektif 2025"
        elif val in ["Retour", "Back"]: trans_ht = "Retounen"
        elif val in ["Nom", "Name"]: trans_ht = "Non"
        elif val in ["Nom complet", "Full Name"]: trans_ht = "Non konplè"
        elif val in ["Email"]: trans_ht = "Imèl"
        elif val in ["Message"]: trans_ht = "Mesaj"
        elif val in ["Téléphone", "Phone"]: trans_ht = "Telefòn"
        elif val in ["Adresse", "Address"]: trans_ht = "Adrès"
        elif val in ["Pays", "Country"]: trans_ht = "Peyi"
        elif val in ["Continuer", "Continue"]: trans_ht = "Kontinye"
        elif val in ["Envoyer", "Send"]: trans_ht = "Voye"
        elif val in ["Annuler", "Cancel"]: trans_ht = "Anile"
        elif val in ["Valider", "Submit"]: trans_ht = "Soumèt"
        elif val == "Notre Histoire": trans_ht = "Istwa Nou"
        elif val == "Notre Stratégie": trans_ht = "Estrateji Nou"
        elif val == "Nos Valeurs": trans_ht = "Valè Nou yo"
        elif "Association pour l'Évangélisation des Enfants" in val: trans_ht = "Asosyasyon Evanjelizasyon Timoun"
        elif "AEE" in val: trans_ht = "AET" 

    out_ht[k] = { "value": trans_ht, "ref": ref, "type": typ }

# WRITE FILES
with open('temp/translations/fr.json', 'w') as f:
    json.dump(out_fr, f, indent=2, ensure_ascii=False)
with open('temp/translations/es.json', 'w') as f:
    json.dump(out_es, f, indent=2, ensure_ascii=False)
with open('temp/translations/ht.json', 'w') as f:
    json.dump(out_ht, f, indent=2, ensure_ascii=False)

print("Translation files generated successfully.")
