import json
import os

# Source of truth
en_path = 'temp/translations/en.json'
fr_path = 'temp/translations/fr.json'
es_path = 'temp/translations/es.json'
ht_path = 'temp/translations/ht.json'

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

en_data = load_json(en_path)
fr_data = load_json(fr_path)
es_data = load_json(es_path)
ht_data = load_json(ht_path)

# Manual translations dictionary (populated based on review of en.json)
# This serves as a lookup for missing translations.
# Format: { "key": { "es": "...", "ht": "...", "fr": "..." } }
# If a key is not here, we might just copy if it looks like a path or name, 
# or use a fallback logic.

translations_map = {
    "about.header.prefix": {"fr": "Chaque", "es": "Cada", "ht": "Chak"},
    "about.header.roll.word1": {"fr": "enfant", "es": "niño", "ht": "timoun"},
    "about.header.roll.word2": {"fr": "nation", "es": "nación", "ht": "nasyon"},
    "about.header.roll.word3": {"fr": "jour", "es": "día", "ht": "jou"},
    "about.header.subtitle": {
        "fr": "Une mission divine pour atteindre et transformer des vies",
        "es": "Una misión divina para alcanzar y transformar vidas",
        "ht": "Yon misyon diven pou rive jwenn ak transfòme lavi yo"
    },
    "about.mission.content": {
        "fr": "L'Association pour l'Évangélisation des Enfants est une organisation mondiale centrée sur la Bible, composée de croyants nés de nouveau, dont le but est d'évangéliser les garçons et les filles avec l'Évangile du Seigneur Jésus-Christ et de les établir dans la Parole de Dieu et dans une église locale pour vivre leur vie chrétienne.",
        "es": "Child Evangelism Fellowship es una organización mundial centrada en la Biblia de creyentes nacidos de nuevo cuyo propósito es evangelizar a niños y niñas con el evangelio del Señor Jesucristo y establecerlos en la palabra de Dios y en una iglesia local para vivir su vida cristiana.",
        "ht": "Asosyasyon Evanjelizasyon Timoun se yon òganizasyon mondyal ki santre sou Labib, ki konpoze de kwayan ki fèt yon dezyèm fwa, ki gen pou objektif pou evanjelize ti gason ak ti fi yo ak Levanjil Senyè Jezi Kris la epi pou etabli yo nan Pawòl Bondye a ak nan yon legliz lokal pou viv lavi kretyen yo."
    },
    "about.mission.cta": {"fr": "En savoir plus", "es": "Saber más", "ht": "Aprann plis"},
    "about.mission.title": {"fr": "Notre Mission", "es": "Nuestra Misión", "ht": "Misyon Nou"},
    "about.vision.card1.desc": {"fr": "Chaque nation", "es": "Cada nación", "ht": "Chak nasyon"},
    "about.vision.card1.title": {"fr": "Chaque enfant", "es": "Cada niño", "ht": "Chak timoun"},
    "about.vision.card2.desc": {"fr": "Chaque nation", "es": "Cada nación", "ht": "Chak nasyon"},
    "about.vision.card2.title": {"fr": "Chaque nation", "es": "Cada nación", "ht": "Chak nasyon"},
    "about.vision.card3.desc": {"fr": "Notre Stratégie", "es": "Nuestra Estrategia", "ht": "Estrateji Nou"},
    "about.vision.card3.title": {"fr": "Chaque jour", "es": "Cada día", "ht": "Chak jou"},
    "about.vision.title": {"fr": "Notre vision", "es": "Nuestra visión", "ht": "Vizyon nou"},

    "contact.header_label": {"fr": "Support", "es": "Soporte", "ht": "Sipò"},
    "contact.back": {"fr": "Retour", "es": "Volver", "ht": "Retounen"},
    "contact.form.next": {"fr": "Continuer", "es": "Continuar", "ht": "Kontinye"},
    "contact.form.send": {"fr": "Envoyer le message", "es": "Enviar mensaje", "ht": "Voye mesaj la"},

    "country.cta.btn": {"fr": "Je m'implique !", "es": "¡Me involucro!", "ht": "Mwen patisipe!"},
    "country.cta.desc": {"fr": "Il y a une place pour vous. Que vous soyez enseignant, priant ou donateur, votre impact commence ici.", "es": "Hay un lugar para ti. Ya seas maestro, orador o donante, tu impacto comienza aquí.", "ht": "Gen yon plas pou ou. Kit ou se yon pwofesè, yon moun k ap priye oswa yon donatè, enpak ou kòmanse isit la."},
    "country.cta.title": {"fr": "Rejoignez l'équipe", "es": "Únete al equipo", "ht": "Antre nan ekip la"},
    
    "footer.about.desc": {
        "fr": "Association pour l'évangélisation des enfants. Évangéliser les enfants avec la Parole de Dieu.",
        "es": "Alianza Pro Evangelización del Niño. Evangelizando a los niños con la Palabra de Dios.",
        "ht": "Asosyasyon Evanjelizasyon Timoun. Evanjelize timoun yo ak Pawòl Bondye a."
    },
    "footer.about.title": {"fr": "AEE", "es": "APEN", "ht": "AET"},
    "footer.copyright": {"fr": "AEE Tous droits réservés.", "es": "APEN Todos los derechos reservados.", "ht": "AET Tout dwa rezève."},
    "footer.quick_links.title": {"fr": "Liens Rapides", "es": "Enlaces Rápidos", "ht": "Lyen Rapid"},
    "footer.support.contact": {"fr": "Contactez-nous", "es": "Contáctenos", "ht": "Kontakte nou"},
    "footer.support.faq": {"fr": "FAQ", "es": "Preguntas Frecuentes", "ht": "Kesyon yo poze souvan"},
    "footer.support.title": {"fr": "Support", "es": "Soporte", "ht": "Sipò"},

    "header.btn.donate": {"fr": "Faire un don", "es": "Donar", "ht": "Fè don"},
    "header.btn.join": {"fr": "Rejoignez-nous", "es": "Únete", "ht": "Rejwenn nou"},
    "header.country_bar.canada": {"fr": "Canada", "es": "Canadá", "ht": "Kanada"},
    "header.nav.about": {"fr": "À propos", "es": "Nosotros", "ht": "A pwopo"},
    "header.nav.contact": {"fr": "Contact", "es": "Contacto", "ht": "Kontak"},
    "header.nav.get_involved": {"fr": "Impliquez-vous", "es": "Involúcrate", "ht": "Patisipe"},
    "header.nav.home": {"fr": "Accueil", "es": "Inicio", "ht": "Akèy"},
    "header.nav.ministries": {"fr": "Ministères", "es": "Ministerios", "ht": "Ministè"},
    "header.nav.staff": {"fr": "Notre équipe", "es": "Nuestro Equipo", "ht": "Ekip Nou"},

    "home.about.badge": {"fr": "Qui sommes-nous", "es": "Quiénes somos", "ht": "Kiyès nou ye"},
    "home.about.cta": {"fr": "En savoir plus", "es": "Saber más", "ht": "Aprann plis"},
    "home.about.desc": {
        "fr": "L'AEE est une organisation mondiale centrée sur la Bible...",
        "es": "APEN es una organización mundial centrada en la Biblia...",
        "ht": "AET se yon òganizasyon mondyal ki santre sou Labib..."
    },
    "home.about.title": {"fr": "Habiliter les enfants, transformer des vies", "es": "Empoderando a los niños, transformando vidas", "ht": "Bay timoun yo pouvwa, transfòme lavi yo"},
    "home.cta_join.btn_primary": {"fr": "Devenir volontaire", "es": "Hacerse voluntario", "ht": "Vin yon volontè"},
    "home.cta_join.btn_secondary": {"fr": "Faire un don", "es": "Donar", "ht": "Fè don"},
    "home.cta_join.desc": {"fr": "Rejoignez notre mission et aidez-nous à transformer la vie des enfants dans chaque nation, chaque jour.", "es": "Únete a nuestra misión y ayúdanos a transformar la vida de los niños en cada nación, cada día.", "ht": "Antre nan misyon nou an epi ede nou transfòme lavi timoun yo nan chak nasyon, chak jou."},
    "home.cta_join.title": {"fr": "Prêt à faire une différence ?", "es": "¿Listo para marcar la diferencia?", "ht": "Pare pou fè yon diferans?"},
    
    "home.director.message": {
        "fr": "C’est avec joie que je vous accueille...",
        "es": "Es un gozo darles la bienvenida...",
        "ht": "Se avèk lajwa m ap akeyi nou..."
    },
    "home.director.subtitle": {"fr": "Message de notre directeur", "es": "Mensaje de nuestro director", "ht": "Mesaj direktè nou an"},
    "home.director.title": {"fr": "Bienvenue dans une nouvelle saison", "es": "Bienvenido a una nueva temporada", "ht": "Byenveni nan yon nouvo sezon"},
    
    "home.events.title": {"fr": "Événements à venir", "es": "Próximos eventos", "ht": "Evènman k ap vini yo"},
    "home.featured_articles.title": {"fr": "Articles en vedette", "es": "Artículos destacados", "ht": "Atik make"},
    "home.featured_books.title": {"fr": "Livres en vedette", "es": "Libros destacados", "ht": "Liv make"},
    
    "home.hero.region_subtitle": {
        "fr": "Région Amérique du Nord, Amérique du Sud et Caraïbes (créole et francophone)",
        "es": "Región de América del Norte, del Sur y del Caribe (de habla criolla y francesa)",
        "ht": "Rejyon Amerik di Nò, Amerik di Sid ak Karayib (kreyòl ak frankofòn)"
    },
    "home.hero.welcome_org": {"fr": "AEE", "es": "APEN", "ht": "AET"},
    "home.hero.welcome_prefix": {"fr": "Bienvenue sur le site de", "es": "Bienvenido al sitio de", "ht": "Byenveni sou sit"},
    
    "home.impact.list_title": {"fr": "Zones d'impact", "es": "Zonas de impacto", "ht": "Zòn enpak"},
    "home.impact.map.label_reached": {"fr": "Enfants atteints l'année dernière", "es": "Niños alcanzados el año pasado", "ht": "Timoun ki te touche ane pase"},
    "home.impact.map.subtitle": {"fr": "Cliquez sur les marqueurs pour voir les détails.", "es": "Haga clic en los marcadores para ver detalles.", "ht": "Klike sou makè yo pou wè detay yo."},
    "home.impact.map.title": {"fr": "Impact régional", "es": "Impacto regional", "ht": "Enpak rejyonal"},
    "home.impact.reached_label": {"fr": "Enfants touchés", "es": "Niños alcanzados", "ht": "Timoun ki touche"},
    "home.impact.read_more": {"fr": "En savoir plus", "es": "Leer más", "ht": "Li plis"},
    "home.impact.stat_label_goal": {"fr": "Objectif 2025", "es": "Meta 2025", "ht": "Objektif 2025"},
    "home.impact.stat_label_reached": {"fr": "Enfants touchés", "es": "Niños alcanzados", "ht": "Timoun ki touche"},
    "home.impact.stat_unit": {"fr": "enfant", "es": "niño", "ht": "timoun"},
    "home.impact.tab.child": {"fr": "Chaque enfant", "es": "Cada niño", "ht": "Chak timoun"},
    "home.impact.tab.day": {"fr": "Chaque jour", "es": "Cada día", "ht": "Chak jou"},
    "home.impact.tab.nation": {"fr": "Chaque nation", "es": "Cada nación", "ht": "Chak nasyon"},
    "home.impact.verse_ref": {"fr": "Matthieu 18:14", "es": "Mateo 18:14", "ht": "Matye 18:14"},
    "home.impact.verse_text": {
        "fr": "« Ce n’est pas la volonté de votre Père... »",
        "es": "«No es la voluntad de vuestro Padre...»",
        "ht": "«Se pa volonte Papa nou...»"
    },
    
    "home.ministries.badge": {"fr": "Nos ministères", "es": "Nuestros ministerios", "ht": "Ministè nou yo"},
    "home.ministries.desc": {"fr": "Découvrez notre impact.", "es": "Descubre nuestro impacto.", "ht": "Dekouvri enpak nou."},
    "home.ministries.title": {"fr": "Transformer des vies", "es": "Transformando vidas", "ht": "Transfòme lavi yo"},
    
    "home.news.title": {"fr": "Nouvelles et mises à jour", "es": "Noticias y actualizaciones", "ht": "Nouvèl ak mizajou"},
    "home.newsletters.title": {"fr": "Archives", "es": "Archivo", "ht": "Achiv"},
    
    "home.slogan.prefix": {"fr": "Nous servons", "es": "Servimos", "ht": "Nou sèvi"},
    "home.slogan.word1": {"fr": "Chaque enfant", "es": "Cada niño", "ht": "Chak timoun"},
    "home.slogan.word2": {"fr": "Chaque nation", "es": "Cada nación", "ht": "Chak nasyon"},
    "home.slogan.word3": {"fr": "Chaque jour", "es": "Cada día", "ht": "Chak jou"},
    
    "home.testimonials.title": {"fr": "Témoignages", "es": "Testimonios", "ht": "Temwayaj"},
    "home.training.title": {"fr": "Formation", "es": "Formación", "ht": "Fòmasyon"},
    
    "home.weekly_highlight.badge": {"fr": "Mot de la semaine", "es": "Palabra de la semana", "ht": "Mo semèn nan"},
    "home.weekly_highlight.cta": {"fr": "Lire la suite", "es": "Leer más", "ht": "Li plis"},
    "home.weekly_highlight.desc": {"fr": "FRET est plus courant que vous ne le pensez...", "es": "FRET es más común de lo que piensas...", "ht": "FRET pi komen pase ou panse..."},
    "home.weekly_highlight.title": {"fr": "Qu'est-ce que FRET ?", "es": "¿Qué es FRET?", "ht": "Kisa FRET ye?"},
    
    "home.weekly_misc.verse_ref_long": {"fr": "Jean 3:16", "es": "Juan 3:16", "ht": "Jan 3:16"},
    "home.weekly_misc.verse_ref_short": {"fr": "JN", "es": "JN", "ht": "JN"},
    "home.weekly_misc.verse_text": {
        "fr": "Car Dieu a tant aimé le monde...",
        "es": "Porque de tal manera amó Dios al mundo...",
        "ht": "Paske Bondye te renmen lemonn..."
    },
    "home.weekly_misc.word_title": {"fr": "Mot de la semaine", "es": "Palabra de la semana", "ht": "Mo semèn nan"},
    "home.weekly_words.title": {"fr": "Mots hebdomadaires", "es": "Palabras semanales", "ht": "Mo chak semèn"},
    
    "implicate.header.desc": {"fr": "Rejoignez-nous !", "es": "¡Únete a nosotros!", "ht": "Rejwenn nou!"},
    "implicate.header.title": {"fr": "Impliquez-vous", "es": "Involúcrate", "ht": "Patisipe"},
    "implicate.modal.btn_cancel": {"fr": "Annuler", "es": "Cancelar", "ht": "Anile"},
    "implicate.modal.btn_send": {"fr": "Envoyer", "es": "Enviar", "ht": "Voye"},
    "implicate.modal.btn_sending": {"fr": "Envoi...", "es": "Enviando...", "ht": "Ap voye..."},
    "implicate.modal.form.address": {"fr": "Adresse", "es": "Dirección", "ht": "Adrès"},
    "implicate.modal.form.church": {"fr": "Église", "es": "Iglesia", "ht": "Legliz"},
    "implicate.modal.form.country": {"fr": "Pays", "es": "País", "ht": "Peyi"},
    "implicate.modal.form.email": {"fr": "Email", "es": "Correo", "ht": "Imèl"},
    "implicate.modal.form.first_name": {"fr": "Prénom", "es": "Nombre", "ht": "Prenon"},
    "implicate.modal.form.last_name": {"fr": "Nom", "es": "Apellido", "ht": "Non"},
    "implicate.modal.form.message": {"fr": "Message", "es": "Mensaje", "ht": "Mesaj"},
    "implicate.modal.form.name": {"fr": "Nom complet", "es": "Nombre completo", "ht": "Non konplè"},
    "implicate.modal.form.phone": {"fr": "Téléphone", "es": "Teléfono", "ht": "Telefòn"},
    "implicate.modal.title_prefix": {"fr": "Postuler pour", "es": "Aplicar para", "ht": "Aplike pou"},
    
    "join.back": {"fr": "Retour", "es": "Volver", "ht": "Retounen"},
    "join.description": {"fr": "Choisissez votre option", "es": "Elige tu opción", "ht": "Chwazi opsyon ou"},
    "join.form.btn_sending": {"fr": "Chargement...", "es": "Cargando...", "ht": "Chaje..."},
    "join.form.btn_submit": {"fr": "S'abonner", "es": "Suscribirse", "ht": "Abòne"},
    "join.form.category": {"fr": "Newsletter", "es": "Boletín", "ht": "Bilten"},
    "join.form.email": {"fr": "Email", "es": "Correo", "ht": "Imèl"},
    "join.form.name": {"fr": "Nom complet", "es": "Nombre completo", "ht": "Non konplè"},
    "join.header_label": {"fr": "Engagement", "es": "Compromiso", "ht": "Angajman"},
    "join.hero.quote": {"fr": "Rejoignez-nous", "es": "Únete a nosotros", "ht": "Rejwenn nou"},
    "join.success.home": {"fr": "Retour", "es": "Volver", "ht": "Retounen"},
    "join.success.message": {"fr": "Merci !", "es": "¡Gracias!", "ht": "Mèsi!"},
    "join.success.title": {"fr": "Confirmation", "es": "Confirmación", "ht": "Konfimasyon"},
    "join.title": {"fr": "Rejoignez l'Aventure", "es": "Únete a la Aventura", "ht": "Antre nan avanti a"},
    "join.type_desc.newsletter": {"fr": "Restez informé", "es": "Mantente informado", "ht": "Rete enfòme"},
    "join.type_desc.record": {"fr": "Enregistrez votre parcours", "es": "Registra tu viaje", "ht": "Anrejistre vwayaj ou"},
    "join.type.newsletter": {"fr": "Newsletter", "es": "Boletín", "ht": "Bilten"},
    "join.type.record": {"fr": "Formation ?", "es": "¿Formación?", "ht": "Fòmasyon?"},
    
    "ministry.club.join_label": {"fr": "S'impliquer", "es": "Participar", "ht": "Patisipe"},
    "ministry.history.badge": {"fr": "Notre Héritage", "es": "Nuestro Legado", "ht": "Eritaj Nou"},
    "ministry.history.p1": {"fr": "Depuis sa fondation...", "es": "Desde su fundación...", "ht": "Depi fondasyon li..."},
    "ministry.history.p2": {"fr": "Pourquoi ces ministères...", "es": "Por qué estos ministerios...", "ht": "Poukisa ministè sa yo..."},
    "ministry.history.title": {"fr": "Porter l'Espoir", "es": "Llevando Esperanza", "ht": "Pote Espwa"},
    "ministry.list.subtitle": {"fr": "Découvrez nos programmes", "es": "Descubre nuestros programas", "ht": "Dekouvri pwogram nou yo"},
    "ministry.list.title": {"fr": "Nos Programmes", "es": "Nuestros Programas", "ht": "Pwogram Nou Yo"},
    
    "nav.contact": {"fr": "Contact", "es": "Contacto", "ht": "Kontak"},
    "nav.get_involved": {"fr": "S'impliquer", "es": "Involucrarse", "ht": "Patisipe"},
    "nav.staff": {"fr": "Équipe", "es": "Equipo", "ht": "Ekip"},
    
    "staff.cta.button": {"fr": "Impliquez-vous", "es": "Involúcrate", "ht": "Patisipe"},
    "staff.cta.desc": {"fr": "Rejoignez l'équipe", "es": "Únete al equipo", "ht": "Antre nan ekip la"},
    "staff.cta.title": {"fr": "Rejoignez Notre Mission", "es": "Únete a Nuestra Misión", "ht": "Antre nan Misyon Nou"},
    "staff.hero.badge": {"fr": "Leadership", "es": "Liderazgo", "ht": "Lidèchip"},
    "staff.hero.subtitle": {"fr": "Rencontrez les leaders", "es": "Conozca a los líderes", "ht": "Rankontre lidè yo"},
    "staff.hero.title": {"fr": "Équipe Régionale", "es": "Equipo Regional", "ht": "Ekip Rejyonal"}
}

# Special fallback for missing keys not in overrides
def generic_translation(text, lang):
    # This acts as a basic fallback if we really don't have a translation.
    # In a real scenario, we'd use a cloud API. Here we just return the text
    # or a mocked translation if it matches common patterns.
    if lang == 'fr':
        if text == "Every": return "Chaque"
        if text == "About": return "À propos"
    return text

def process(lang, target_data, en_data):
    new_data = {
        "_meta": {
            "language": lang,
            "country_code": en_data["_meta"]["country_code"],
            "page_filter": en_data["_meta"]["page_filter"],
            "exported_at": en_data["_meta"]["exported_at"],
            "total_keys": en_data["_meta"]["total_keys"],
            "instructions": en_data["_meta"]["instructions"]
        }
    }
    
    for k, v in en_data.items():
        if k == "_meta": continue
        
        # Determine value
        val = ""
        
        # 1. Existing value in target file
        if k in target_data and target_data[k].get("value"):
            val = target_data[k]["value"]
        
        # 2. Check manual map
        elif k in translations_map and lang in translations_map[k]:
            val = translations_map[k][lang]
            
        # 3. Fallback: If it's an image/url, keep strictly
        elif v["type"] == "image" or v["value"].strip().startswith("/") or v["value"].strip().startswith("http"):
             val = v["value"]
             
        # 4. Fallback: If text, try to use English value (better than nothing)
        #    or reuse existing French value if source was already French (ref/val same)
        else:
            # If the source 'value' seems to be the same as 'ref' and we have no translation,
            # we default to source value.
            val = v["value"]
            
        new_data[k] = {
            "value": val,
            "ref": v["ref"], # Keep English ref
            "type": v["type"]
        }
    
    return new_data

fr_final = process('fr', fr_data, en_data)
es_final = process('es', es_data, en_data)
ht_final = process('ht', ht_data, en_data)

save_json(fr_path, fr_final)
save_json(es_path, es_final)
save_json(ht_path, ht_final)

print("Translation files updated.")
