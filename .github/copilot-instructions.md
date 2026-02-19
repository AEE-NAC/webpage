# Instructions du Projet

## Code Style
- Utiliser **Tailwind CSS** pour le style.
- Assurer un typage TypeScript strict pour toutes les props et retours de fonctions.

## Conventions de Nommage
- **Composants React** : PascalCase (ex: `ServiceCard.tsx`).
- **Variables et Fonctions** : camelCase (ex: `fetchData`).
- **Interfaces et Types** : PascalCase (ex: `UserProps`).
- **Fichiers** : kebab-case pour les fichiers non-composants (ex: `utils-helper.ts`).

## Internationalisation (i18n) et CMS
Le projet utilise un système CMS dynamique via Supabase.
- **Textes** : Utiliser impérativement `<CMSText k="la.cle" defaultVal="Texte par défaut" />`.
- **Images** : Utiliser impérativement `<CMSImage k="la.cle" defaultSrc="/chemin/image.jpg" ... />`.
- **Hiérarchie des Clés** :
  - `nav.*` : Navigation globale.
  - `footer.*` : Pied de page global.
  - `shared.*` : Composants réutilisables sur plusieurs pages.
  - `[page_name].*` : Contenu spécifique à une page (ex: `about.hero.title`).
- **Chargement** : Les composants communs (`Header`, `Footer`) et les composants partagés (`shared.`) sont automatiquement chargés dans le dictionnaire via `CMSService.getPageContent`.

## Design System & Palette de Couleurs
Respecter les variables définies dans `app/globals.css` (OKLCH) :
- **Background** : `var(--background)` / `bg-background`
- **Foreground** : `var(--foreground)` / `text-foreground`
- **Primary** : `var(--primary)` / `bg-primary` (Marron/Gris sombre : oklch(0.205 0 0))
- **Secondary** : `var(--secondary)` / `bg-secondary` (Blanc cassé : oklch(0.97 0 0))
- **Destructive** : `var(--destructive)` / `bg-destructive` (Rouge : oklch(0.577 0.245 27.325))
- **Muted** : `var(--muted)` / `bg-muted`
- **Borders/Inputs** : `var(--border)`, `var(--input)`

## Architecture
- `app/` : Routage Next.js App Router.
- `components/cms/` : Moteur de rendu dynamique.
- `components/ui/` : Atomes graphiques (Shadcn/Radix).
- `services/` : Connexion aux services externes (Supabase).
- `context/` : Gestion des états globaux et de l'adaptation régionale.

## Tests
- Utiliser Vitest pour les tests unitaires et d'intégration.
- Placer les tests dans un dossier `test/` ou à proximité du fichier source.
