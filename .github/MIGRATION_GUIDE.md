# 📋 Guide de Migration Supabase → Directus

## 🎯 Vue d'ensemble

Votre application a été migrée de **Supabase** vers **Directus** pour l'infrastructure CMS. Tous les composants React continuent à fonctionner de la même manière - seule la source de données change.

**Points clés :**
- ✅ Zéro changement dans les composants `CMSText`, `CMSImage`, `CMSVideo`
- ✅ Zéro changement dans la `CMSProvider`
- ✅ Service `CMSService` remplacé pour utiliser Directus au lieu de Supabase
- ✅ Support du Visual Editor de Directus
- ✅ Gestion native des traductions avec langues (fr-FR, en-US, es-ES, ht-HT)

---

## 🚀 Architecture

### Flux de Données

```
┌─────────────────────────┐
│   Frontend Components   │
│  (CMSText, CMSImage)    │
└──────────────┬──────────┘
               │ utilise
               ▼
        ┌──────────────┐
        │   useCMS()   │ → Récupère dictionary
        └──────────────┘
               │
        ┌──────────────────────┐
        │   CMSProvider        │ → Charge via CMSService
        │  (context global)    │
        └──────────────────────┘
               │
        ┌──────────────────────┐
        │   CMSService         │ → Directus API
        │  (directus.conf.ts)  │
        └──────────────────────┘
               │
        ┌──────────────────────┐
        │   Directus API       │
        │  (cms.aeenac.org)    │
        └──────────────────────┘
```

### Collections Directus

#### 1. **languages** (Référence)
```typescript
{
  code: string;   // "fr-FR", "en-US", "es-ES", "ht-HT"
  label: string;  // "Français", "English", etc.
}
```

#### 2. **cms_content** (Contenu Clé/Valeur)
```typescript
{
  id: string;
  key: string;                    // "home.hero.title"
  content_type: 'text' | 'image' | 'html';
  value?: string;                 // Valeur par défaut/fallback
  status: 'draft' | 'published' | 'archived';
  date_created: string;
  date_updated: string;
  
  translations: [
    {
      id: number;
      languages_code: string;      // "fr-FR", "en-US", etc.
      value: string;               // Contenu traduit
    }
  ]
}
```

#### 3. **cms_popovers** (Annonces/Modales)
```typescript
{
  id: string;
  name: string;                    // "promo-summer"
  is_active: boolean;
  component_type: 'modal' | 'banner';
  target_pages: string[];          // ["/", "/pricing"]
  image?: string;                  // File ID Directus
  start_at?: string;               // ISO datetime
  end_at?: string;                 // ISO datetime
  status: 'draft' | 'published' | 'archived';
  
  translations: [
    {
      id: number;
      languages_code: string;
      title?: string;
      body?: string;
      cta_text?: string;
      cta_url?: string;
    }
  ]
}
```

#### 4. **cms_weekly_words** (Mots de la Semaine)
```typescript
{
  id: string;
  start_date?: string;             // "2026-05-18"
  end_date?: string;               // "2026-05-25"
  image?: string;                  // File ID Directus
  status: 'draft' | 'published' | 'archived';
  
  translations: [
    {
      id: number;
      languages_code: string;
      title?: string;
      content?: string;
      author_name?: string;
      author_role?: string;
    }
  ]
}
```

#### 5. **cms_newsletters** (Newsletters)
```typescript
{
  id: string;
  publication_date?: string;       // ISO datetime
  pdf_file?: string;               // File ID Directus
  
  translations: [
    {
      id: number;
      languages_code: string;
      title?: string;
    }
  ]
}
```

---

## 🛠️ Utilisation pour Développeurs

### Charger du contenu CMS

```typescript
import { CMSService } from '@/services/directus.conf';

// Charger tout le contenu d'une page avec traductions
const dictionary = await CMSService.getPageContent(
  'about',     // Préfixe clé (ex: "about.hero.title")
  'fr-FR',     // Langue
  'HT',        // Code pays (optionnel)
  ['shared.']  // Préfixes supplémentaires à charger
);

// dictionary["about.hero.title"] = "Bienvenue"
```

### Utiliser les composants CMS

```typescript
import { CMSText, CMSImage } from '@/components/cms';

export function MyComponent() {
  return (
    <>
      {/* Texte - charge depuis CMS ou utilise defaultVal */}
      <CMSText 
        k="about.hero.title" 
        defaultVal="Default Title"
        className="text-3xl font-bold"
      />
      
      {/* Image */}
      <CMSImage 
        k="about.hero.image" 
        defaultSrc="/images/default.jpg"
        alt="Hero"
      />
    </>
  );
}
```

### Fonctions Utilitaires

```typescript
import { CMSService } from '@/services/directus.conf';

// Popovers actifs pour la langue courante
const popovers = await CMSService.getActivePopovers('fr-FR', 'HT');

// Mots de la semaine
const weeklyWords = await CMSService.getWeeklyWords('fr-FR');

// Newsletters
const newsletters = await CMSService.getNewsletters('fr-FR');

// URL d'asset transformée
const imageUrl = CMSService.getAssetUrl(fileId, { width: 1200, format: 'webp' });
```

---

## 🌐 Guide Éditorial (Pour l'Équipe Éditoriale)

### Accéder à Directus

**URL :** https://cms.aeenac.org  
**Login :** Via SSO ou compte email  
**Permissions :** Accès en lecture-écriture aux collections CMS

### Éditer du Contenu

#### Étape 1 : Aller dans la collection
1. Accédez à **Content** → **cms_content**
2. Cherchez la clé (ex: `about.hero.title`)
3. Cliquez sur la ligne pour ouvrir

#### Étape 2 : Ajouter/Éditer Traductions
1. Trouvez la section **Translations** dans le formulaire
2. Cliquez sur **+ Add New**
3. Sélectionnez la langue (Français, English, Español, Kreyòl)
4. Saisissez le texte
5. Cliquez **Save** (Ctrl+S)

#### Étape 3 : Visualiser sur le site
- La page se met à jour automatiquement dans les **30 secondes**
- (ISR - Incremental Static Regeneration)

### Ajouter une Image

1. Allez dans **cms_popovers** ou **cms_weekly_words**
2. Trouvez le champ **image**
3. Cliquez sur **Choose from library** ou **Upload**
4. Sélectionnez/uploadez l'image
5. Sauvegardez

### Visual Editor (Bonus)

1. Allez sur votre site frontend
2. Cherchez le **lock 🔒** icon en bas à droite
3. Déverrouillez-le
4. Cliquez sur n'importe quel texte CMS pour l'éditer directement
5. Les changements se sauvegardent instantanément

---

## 🔄 Migration des Données (Déjà Faite ✅)

### Script de Migration

Si vous avez besoin de migrer à nouveau :

```bash
# Export + Import complet
npm run migrate:cms

# Export uniquement
npx tsx scripts/migrate-supabase-to-directus.ts --export

# Import uniquement (utilise l'export précédent)
npx tsx scripts/migrate-supabase-to-directus.ts --import
```

### Résultats Exportés

Les données sont sauvegardées dans `temp/migration-export/` :
- `01_supabase_cms_content.json` - Données brutes Supabase
- `05_directus_cms_content.json` - Données transformées pour Directus
- (et autres fichiers pour popovers, newsletters, etc.)

---

## 📊 Schéma Relatif Complet

```
languages (PK: code)
  ├─ code: string
  └─ label: string

cms_content (PK: id)
  ├─ id: uuid
  ├─ key: string (UNIQUE)
  ├─ content_type: enum
  ├─ value: string (fallback)
  ├─ status: enum
  ├─ date_created: datetime
  ├─ date_updated: datetime
  └─ translations (relation m2m)
       ├─ id: int (PK)
       ├─ cms_content_id: uuid (FK)
       ├─ languages_code: string (FK)
       └─ value: string

cms_popovers (PK: id)
  ├─ id: uuid
  ├─ name: string (UNIQUE)
  ├─ is_active: boolean
  ├─ component_type: enum
  ├─ target_pages: json
  ├─ image: uuid (FK to directus_files)
  ├─ start_at: datetime
  ├─ end_at: datetime
  ├─ status: enum
  └─ translations (relation m2m)
       ├─ id: int (PK)
       ├─ cms_popovers_id: uuid (FK)
       ├─ languages_code: string (FK)
       ├─ title: string
       ├─ body: string
       ├─ cta_text: string
       └─ cta_url: string

cms_weekly_words (PK: id)
  ├─ id: uuid
  ├─ start_date: date
  ├─ end_date: date
  ├─ image: uuid (FK to directus_files)
  ├─ status: enum
  └─ translations (relation m2m)
       ├─ id: int (PK)
       ├─ cms_weekly_words_id: uuid (FK)
       ├─ languages_code: string (FK)
       ├─ title: string
       ├─ content: string
       ├─ author_name: string
       └─ author_role: string

cms_newsletters (PK: id)
  ├─ id: uuid
  ├─ publication_date: datetime
  ├─ pdf_file: uuid (FK to directus_files)
  └─ translations (relation m2m)
       ├─ id: int (PK)
       ├─ cms_newsletters_id: uuid (FK)
       ├─ languages_code: string (FK)
       └─ title: string

directus_files (PK: id)
  ├─ id: uuid
  ├─ title: string
  ├─ description: string
  ├─ filename_download: string
  ├─ type: string (mime type)
  ├─ filesize: int
  ├─ width: int (images)
  ├─ height: int (images)
  └─ storage: string
```

---

## ⚙️ Configuration Directus

### Variables d'Environnement

```env
# .env.local
NEXT_PUBLIC_DIRECTUS_URL=https://cms.aeenac.org
NEXT_PUBLIC_DIRECTUS_TOKEN=_wPM1e984JpdaggF2kFXaFW_CuDBTlb4

# Supabase (toujours utilisé pour données métier)
NEXT_PUBLIC_SUPABASE_URL=https://pfijkpxlsbyepxhwjsep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Permissions Publiques

**Setting → Access Control → Public Role :**
- ✅ Read: `cms_content`, `cms_popovers`, `cms_weekly_words`, `cms_newsletters`, `languages`
- ✅ Read (limited): `directus_files` (avec transformations d'image)
- ❌ Create/Update/Delete: Tous

### CORS

**Settings → Project Settings → CORS Origins :**
```
http://localhost:3000
https://your-domain.com
https://cms.aeenac.org
```

---

## 🐛 Dépannage

### "Missing Key" en Console

```
[CMS] Missing Key: "about.hero.title"
Using default: "Default Title"
```

**Cause :** La clé n'existe pas en base Directus pour la langue courante  
**Solution :**
1. Vérifiez que la clé existe dans Directus
2. Vérifiez que la langue est correcte (fr-FR, en-US, etc.)
3. Si la clé n'existe pas, créez-la via Directus CMS UI

### Directus API Lente

**Cause :** Requête sans filtrage adéquat  
**Solution :**
- Le service recharge en cache 60 secondes (ISR)
- Assurez que `NEXT_PUBLIC_DIRECTUS_TOKEN` est valide
- Vérifiez la charge du serveur Directus

### Image ne s'affiche pas

**Cause :** File ID invalide ou permissions incorrectes  
**Solution :**
1. Vérifiez le File ID dans Directus
2. Testez l'URL directement : `https://cms.aeenac.org/assets/{FILE_ID}`
3. Vérifiez les permissions publiques sur `directus_files`

---

## 📚 Ressources

- **Directus Admin :** https://cms.aeenac.org
- **Directus Docs :** https://docs.directus.io
- **SDK TypeScript :** https://sdk.directus.io
- **API Reference :** https://docs.directus.io/reference/introduction

---

## ✅ Checklist Post-Migration

- [ ] Directus Cloud/Self-hosted est operationnel
- [ ] Collections créées : `languages`, `cms_content`, `cms_popovers`, `cms_weekly_words`, `cms_newsletters`
- [ ] Données migrées depuis Supabase
- [ ] Variables d'environnement définies
- [ ] Tests : `npm run dev` charge le CMS depuis Directus
- [ ] Équipe éditoriale peut accéder à Directus
- [ ] Visual Editor testé (optionnel)
- [ ] Supabase gardé comme backup (pour données métier)

---

## 🔐 Sécurité

- ⚠️ **Token Public :** Utilisé uniquement pour READ sur collections CMS
- ⚠️ **Token Admin :** Stocké côté serveur pour opérations edit
- ✅ **CORS :** Configuré pour domaines de production uniquement
- ✅ **Permissions :** Public role limité à CMS collections

---

## 📞 Support

Pour questions ou problèmes :
1. Consultez la documentation Directus
2. Vérifiez les logs de l'API Directus
3. Testez les requêtes API directement

---

**Migration complétée le :** 18 mai 2026  
**Status :** ✅ Production Ready
