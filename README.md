# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/86b3e788-c7bb-4791-91fc-97ff9ffe4e0b

---

## Architecture

- **Frontend** : React 18, Vite, shadcn-ui, Tailwind CSS
- **Backend** : Supabase (auth, stockage, RAG)
- **Intégrations** : Clerk, Supabase, Radix UI
- **Organisation** :
  - `src/pages` : pages principales (business, personal, ai, rag, settings)
  - `src/components` : composants UI et fonctionnels
  - `src/hooks` : hooks personnalisés
  - `src/utils` : utilitaires
  - `src/integrations` : intégrations externes
  - `src/types` : types TypeScript

## Variables d'environnement

Documentez vos variables dans `.env` :
- `SUPABASE_URL`
- `SUPABASE_KEY`
- ...

## Conventions de nommage
- Kebab-case pour les dossiers de routes
- PascalCase pour les composants
- camelCase pour les fonctions et variables

## Scripts utiles

- `npm run dev` : démarre le serveur de dev
- `npm run build` : build de production
- `npm run lint` : lint du code
- `npm run preview` : prévisualisation
- `npm run format` : formatte le code avec Prettier

## Tests

Les tests unitaires sont dans `/tests` et suivent la structure du code source. Utilisez `vitest` pour les lancer.

## Badges

![build](https://img.shields.io/badge/build-passing-brightgreen)
![tests](https://img.shields.io/badge/tests-passing-brightgreen)

---

## How can I edit this code?

... (reste du README inchangé) ...
