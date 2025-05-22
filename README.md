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

Documentez vos variables dans `.env` (voir aussi `env.example` à la racine du projet) :

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` : Clé publique Clerk pour l'auth côté client (Next.js/Vite)
- `CLERK_SECRET_KEY` : Clé secrète Clerk pour l'auth côté serveur
- `VITE_CLERK_PUBLISHABLE_KEY` : Clé publique Clerk pour Vite
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre instance Supabase (Next.js/Vite)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase (Next.js/Vite)
- `VITE_SUPABASE_URL` : URL de votre instance Supabase (Vite)
- `VITE_SUPABASE_ANON_KEY` : Clé anonyme Supabase (Vite)

**Astuce :** Copiez le fichier `env.example` et renommez-le `.env` pour démarrer rapidement.

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

## Gestion des erreurs

L'application utilise un gestionnaire d'erreurs centralisé (`ErrorHandler`) situé dans `src/utils/errorHandler.ts`.

- Utilisez toujours `ErrorHandler.handleError` pour loguer et afficher les erreurs côté utilisateur.
- Pour les erreurs Supabase/API/Auth, utilisez les méthodes dédiées (`handleSupabaseError`, `handleApiError`, `handleAuthError`).
- Les erreurs sont loguées dans la console et affichées à l'utilisateur via un toast.

**Exemple :**
```ts
try {
  // ...
} catch (err) {
  ErrorHandler.handleError(err, 'Contexte de l\'erreur');
}
```

## Typage strict Supabase (Typescript)

Le projet utilise deux stratégies pour les types Supabase :

- **Typage strict généré** : pour les accès à la table `user_supabase_credentials`, on utilise le type généré automatiquement par Supabase CLI (`src/types/supabase.generated.ts`).
- **Typage large** : pour le client global (dans `src/lib/supabaseClient.ts`), on utilise le type large défini dans `src/integrations/supabase/types.ts` qui contient toutes les tables utilisées dans l'app.

**Pourquoi ?**
- Le type généré par Supabase CLI ne contient que les tables du schéma public ou sélectionnées lors de la génération. Tant que toutes les tables ne sont pas incluses, il ne faut pas l'utiliser pour le client global.
- Pour garantir la robustesse sur les accès sensibles (ex : credentials utilisateurs), on applique le typage strict localement dans les hooks/services concernés.

**Générer les types à jour :**
```sh
npx supabase gen types typescript --project-id <project-id> --schema public > src/types/supabase.generated.ts
```

**Convention :**
- Pour tout accès à `user_supabase_credentials`, importer le type `Database` depuis `src/types/supabase.generated.ts` et créer un client local typé.
- Pour le reste, continuer d'utiliser le type large global.

## Migration Supabase (2024-07-09)

> **Important :** La logique multi-instance Supabase (connexion individuelle par utilisateur) a été désactivée. Toutes les données de tous les utilisateurs sont désormais stockées dans l'instance Supabase globale du projet.

- **Client global** : Toute l'application utilise le client partagé défini dans `src/lib/supabaseClient.ts`.
- **Hooks et composants** : Tous les hooks et composants accèdent à Supabase via ce client global.
- **Ancienne logique** : Les fichiers liés à la gestion individuelle (provider dynamique, hooks credentials, etc.) sont commentés mais conservés pour référence.
- **Typage** : Le typage de la table `mcp_connections` a été ajouté dans `src/integrations/supabase/types.ts`.

Pour toute modification future, il suffit d'adapter la configuration dans `src/lib/supabaseClient.ts` et les variables d'environnement associées.
