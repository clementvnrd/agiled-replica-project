# PLANNING.md

## Objectif du projet
Application React/Vite avec intégration Supabase, gestion multi-domaines (business, personal), UI shadcn, Tailwind, et gestion d'agents IA.

## Architecture
- Frontend : React 18, Vite, shadcn-ui, Tailwind CSS
- Backend : Supabase (auth, stockage, RAG)
- Intégrations : Clerk, Supabase, Radix UI
- Organisation :
  - `src/pages` : pages principales (business, personal, ai, rag, settings)
  - `src/components` : composants UI et fonctionnels
  - `src/hooks` : hooks personnalisés
  - `src/utils` : utilitaires
  - `src/integrations` : intégrations externes
  - `src/types` : types TypeScript

## Contraintes
- Fichiers < 500 lignes
- Tests unitaires Pytest (à adapter en Jest/Testing Library pour React)
- Validation avec zod
- Respect PEP8/Black (adapter à Prettier/ESLint pour JS/TS)
- Documentation et commentaires explicites

## TODOs
- Ajouter des tests unitaires pour chaque module
- Documenter les variables d'environnement
- Refactoriser les gros composants (>200 lignes)
- Centraliser la gestion des erreurs
