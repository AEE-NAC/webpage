# 🔌 Directus API Reference

## 📍 Base URL

```
https://cms.aeenac.org
```

## 🔑 Authentification

### Public Access (Read-only)
```bash
curl -H "Authorization: Bearer <PUBLIC_TOKEN>" \
  https://cms.aeenac.org/items/cms_content
```

### Admin Access (Server-side)
```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  https://cms.aeenac.org/items/cms_content
```

---

## 📚 Collections & Endpoints

### 1. **languages** - Référence des Langues

#### List All Languages
```bash
GET /items/languages
```

**Response:**
```json
{
  "data": [
    { "code": "fr-FR", "label": "Français" },
    { "code": "en-US", "label": "English" },
    { "code": "es-ES", "label": "Español" },
    { "code": "ht-HT", "label": "Kreyòl Ayisyen" }
  ]
}
```

---

### 2. **cms_content** - Contenu Clé/Valeur

#### Get All Content
```bash
GET /items/cms_content?limit=-1&fields=id,key,content_type,translations.*
```

#### Get by Key
```bash
GET /items/cms_content?filter[key][_eq]=about.hero.title&fields=*,translations.*
```

#### Get by Prefix
```bash
GET /items/cms_content?filter[key][_starts_with]=about.&limit=-1&fields=*,translations.*
```

#### Get French Translations Only
```bash
GET /items/cms_content?fields=id,key,translations.languages_code,translations.value&deep[translations][_filter][languages_code][_eq]=fr-FR
```

#### Create Content
```bash
POST /items/cms_content
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "key": "about.hero.title",
  "content_type": "text",
  "value": "Bienvenue",
  "status": "published",
  "translations": [
    {
      "languages_code": "fr-FR",
      "value": "Bienvenue"
    },
    {
      "languages_code": "en-US",
      "value": "Welcome"
    }
  ]
}
```

#### Update Content
```bash
PATCH /items/cms_content/{id}
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "value": "New Value",
  "translations": [
    {
      "languages_code": "fr-FR",
      "value": "Nouvelle Valeur"
    }
  ]
}
```

---

### 3. **cms_popovers** - Modales/Annonces

#### Get Active Popovers
```bash
GET /items/cms_popovers?filter[is_active][_eq]=true&filter[status][_neq]=archived&fields=*,translations.*
```

#### Get Popovers for Specific Page
```bash
GET /items/cms_popovers?filter[is_active][_eq]=true&filter[target_pages][_contains]=/about&fields=*,translations.*
```

#### Create Popover
```bash
POST /items/cms_popovers
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "name": "promo-summer",
  "is_active": true,
  "component_type": "modal",
  "target_pages": ["/", "/pricing"],
  "image": null,
  "start_at": "2026-05-18T10:00:00Z",
  "end_at": "2026-06-01T23:59:59Z",
  "status": "published",
  "translations": [
    {
      "languages_code": "fr-FR",
      "title": "Promo Été",
      "body": "Profitez de notre offre",
      "cta_text": "En Savoir Plus",
      "cta_url": "/offres"
    }
  ]
}
```

---

### 4. **cms_weekly_words** - Mots de la Semaine

#### Get All Weekly Words
```bash
GET /items/cms_weekly_words?sort=-start_date&limit=-1&fields=*,translations.*
```

#### Get Current Week
```bash
GET /items/cms_weekly_words?filter[status][_neq]=archived&sort=-start_date&limit=1&fields=*,translations.*
```

#### Create Weekly Word
```bash
POST /items/cms_weekly_words
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "start_date": "2026-05-18",
  "end_date": "2026-05-25",
  "image": null,
  "status": "published",
  "translations": [
    {
      "languages_code": "fr-FR",
      "title": "Titre de la Semaine",
      "content": "Contenu du mot de la semaine",
      "author_name": "Jean Dupont",
      "author_role": "Pasteur"
    }
  ]
}
```

---

### 5. **cms_newsletters** - Newsletters

#### Get All Newsletters
```bash
GET /items/cms_newsletters?sort=-publication_date&limit=-1&fields=*,translations.*
```

#### Get Recent Newsletters
```bash
GET /items/cms_newsletters?sort=-publication_date&limit=10&fields=id,publication_date,pdf_file.id,pdf_file.filename_download,translations.*
```

#### Create Newsletter
```bash
POST /items/cms_newsletters
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "publication_date": "2026-05-18T10:00:00Z",
  "pdf_file": "file-uuid-here",
  "translations": [
    {
      "languages_code": "fr-FR",
      "title": "Newsletter Mai 2026"
    }
  ]
}
```

---

### 6. **directus_files** - Gestion des Fichiers

#### Upload File
```bash
POST /files
Content-Type: multipart/form-data
Authorization: Bearer <TOKEN>

file: <binary>
title: "My Image"
description: "Image description"
```

#### Get File Info
```bash
GET /files/{id}
```

#### Get File URL
```
{directus_url}/assets/{file_id}
```

#### Get File with Transformations
```
{directus_url}/assets/{file_id}?width=1200&height=600&format=webp
```

---

## 🔗 Query Patterns

### Filtering

```bash
# Equals
?filter[status][_eq]=published

# Not equals
?filter[status][_neq]=archived

# Greater than
?filter[start_date][_gt]=2026-05-01

# Less than
?filter[end_date][_lt]=2026-06-01

# In array
?filter[target_pages][_contains]=/about

# Starts with
?filter[key][_starts_with]=about.

# Multiple filters (AND)
?filter[is_active][_eq]=true&filter[status][_neq]=archived

# Multiple filters (OR)
?filter[_or][0][status][_eq]=draft&filter[_or][1][status][_eq]=published
```

### Sorting

```bash
# Ascending
?sort=key

# Descending
?sort=-creation_date

# Multiple fields
?sort=-start_date,key
```

### Pagination

```bash
# Limit & offset
?limit=10&offset=0

# Get all (use with caution)
?limit=-1
```

### Fields

```bash
# Specific fields only
?fields=id,key,value

# All fields including relations
?fields=*,translations.*

# Deep nesting
?fields=id,name,image.id,image.filename_download
```

---

## 📊 Response Format

### Success Response (200)
```json
{
  "data": [
    {
      "id": "uuid",
      "key": "about.hero.title",
      "content_type": "text",
      "value": "Bienvenue",
      "translations": [
        {
          "id": 1,
          "languages_code": "fr-FR",
          "value": "Bienvenue"
        }
      ]
    }
  ]
}
```

### Error Response (400+)
```json
{
  "errors": [
    {
      "message": "Invalid request",
      "extensions": {
        "code": "INVALID_PAYLOAD"
      }
    }
  ]
}
```

---

## 🧪 cURL Examples

### Get Home Content (French)
```bash
curl -X GET \
  'https://cms.aeenac.org/items/cms_content?filter[key][_starts_with]=home.&fields=*,translations.*' \
  -H 'Authorization: Bearer <PUBLIC_TOKEN>'
```

### Get Active Popovers
```bash
curl -X GET \
  'https://cms.aeenac.org/items/cms_popovers?filter[is_active][_eq]=true&filter[status][_neq]=archived&fields=*,translations.*' \
  -H 'Authorization: Bearer <PUBLIC_TOKEN>'
```

### Create New Content (Admin)
```bash
curl -X POST \
  'https://cms.aeenac.org/items/cms_content' \
  -H 'Authorization: Bearer <ADMIN_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "new.key",
    "content_type": "text",
    "value": "Default",
    "status": "published",
    "translations": [
      {"languages_code": "fr-FR", "value": "Contenu"}
    ]
  }'
```

---

## 🛠️ Rate Limiting

- Public API: 100 requests/minute
- Authenticated: 1000 requests/minute
- File uploads: 10 uploads/minute

---

## 📝 Best Practices

1. **Use field limiting** : `?fields=id,key,value` au lieu de `?fields=*`
2. **Use filtering** : `?filter[status][_eq]=published` pour éviter les archives
3. **Cache responses** : Utilisez ISR (60 sec) ou Redis côté frontend
4. **Batch requests** : Pour plusieurs items, une seule requête avec filtre
5. **Error handling** : Toujours gérer les cas 404 et 500

---

## 📚 Documentation Officielle

- Directus REST API: https://docs.directus.io/reference/items
- Query Language: https://docs.directus.io/reference/query
- Authentication: https://docs.directus.io/reference/authentication

---

## 💡 Cas d'Usage

### Frontend (React/Next.js)
```typescript
const response = await fetch(
  'https://cms.aeenac.org/items/cms_content?filter[key][_eq]=about.hero.title&fields=*,translations.*',
  {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`
    }
  }
);
const { data } = await response.json();
```

### Backend (Node.js)
```typescript
const response = await fetch(
  'https://cms.aeenac.org/items/cms_content',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key: 'new.key',
      content_type: 'text',
      value: 'New Value',
      status: 'published'
    })
  }
);
```

---

**Last Updated:** 18 mai 2026  
**Status:** ✅ Production Ready
