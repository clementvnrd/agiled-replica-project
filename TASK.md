# TASK.md

## Tâches en cours
- Audit du projet, détection et correction des problèmes, erreurs, manques d'optimisation (2024-07-09)
- Refactor onboarding Supabase utilisateur (2024-07-09)
  - Objectif : Chaque utilisateur peut connecter sa propre instance Supabase, utilisée pour toutes ses données (RAG, stockage, etc.), de façon isolée et sécurisée.
  - [ABANDONNÉ/PAUSÉ le 2024-07-09] : La logique multi-instance Supabase est désactivée. Toutes les données sont désormais stockées dans l'instance Supabase globale du projet.
  - Étapes à implémenter :
    1. **Inscription avec Clerk**
       - L'utilisateur crée son compte (Clerk gère l'auth).
    2. **Redirection vers une page d'onboarding**
       - Cette page explique pourquoi il doit connecter Supabase, et comment créer son projet Supabase (avec un guide clair).
    3. **Formulaire de connexion Supabase**
       - L'utilisateur colle son URL et sa clé anonyme.
       - La web app teste la connexion (retourne une erreur claire si mauvais).
       - Si OK, les credentials sont stockés côté app (dans la DB utilisateur, ou dans un storage sécurisé lié à l'utilisateur).
    4. **Accès à l'app**
       - Toutes les requêtes backend (RAG, stockage, etc.) utilisent les credentials Supabase de l'utilisateur.
    5. **Correction du test de connexion**
       - Ne pas planter si la table n'existe pas, afficher un message d'aide si besoin.
    6. **Modification des credentials**
       - Permettre à l'utilisateur de modifier ses credentials Supabase dans les settings.
    7. **Robustesse du flow**
       - Pas de boucle, pas de page blanche, erreurs explicites, UX claire.

- **Correction architecture Clerk & Supabase Multi-Tenant (2024-07-09)**
#follow les instructions de "Guide de Correction_ Intégration Clerk & Supabase (Multi-tenant).md"
  - [x] 1. Simplifier l'auth Clerk (ClerkProvider dans main.tsx, plus de sync JWT global)
  - [x] 2. Supprimer le hook useClerkSupabaseAuth et clerkJwt.ts
  - [x] 3. Vérifier que useUserSupabaseCredentials utilise bien le client global
  - [x] 4. Créer DynamicSupabaseContext (client dynamique par utilisateur)
  - [ ] 5. Intégrer le provider dynamique dans App.tsx
  - [ ] 6. Adapter OnboardingWrapper pour la logique credentials
  - [ ] 7. Adapter tous les hooks d'accès aux données pour utiliser le client dynamique
  - [ ] 8. Configurer RLS sur les bases utilisateurs (ex: rag_documents)
  - [ ] 9. Nettoyer le code et tester le flow complet

## Tâches terminées
- [x] Centralisation des erreurs modules/services
- [x] Correction imports ErrorHandler
- [x] Suppression console.error/warn
- [x] Migration Supabase : désactivation de la logique multi-instance, centralisation sur le client global partagé (2024-07-09)
    - Tous les hooks et composants utilisent maintenant le client global (src/lib/supabaseClient.ts)
    - Les fichiers liés à la gestion individuelle sont commentés, non supprimés
    - Typage corrigé pour la table mcp_connections
    - Documentation et README mis à jour

## Découvertes pendant le travail
- Absence de tests unitaires
- Absence de gestion centralisée des erreurs
- Absence de documentation sur les variables d'environnement
- Fichiers composants volumineux (>200 lignes)
- [ ] Refactor all user-data hooks to use the dynamic Supabase client (if not already present)

// Discovered During Work :
- [ ] TODO : Renforcer typage dynamique des retours Supabase dans useMcpConnections
- [ ] TODO : Tests unitaires ErrorHandler
- [ ] TODO : Vérifier la couverture de tests sur tous les hooks/services modifiés
