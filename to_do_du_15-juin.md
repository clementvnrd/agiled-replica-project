
# "To Do" du 15 Juin (Audit Complet)

Liste des améliorations à apporter à l'application, basée sur l'audit complet du 15/06.

## 1. Fonctionnalités (Améliorations et Nouveautés)

- [x] **Dashboard Dynamique :** Connecter les `StatCard` du `DashboardBusiness.tsx` aux données réelles des projets et des tâches. **(FAIT)**
- [ ] **Gestion des Projets :** Ajouter la possibilité de voir le nombre de tâches par projet sur la page de liste des projets.
- [ ] **Centre de Notifications :** Mettre en place un système de notifications (tâches assignées, mentions).
- [ ] **Recherche Globale :** Activer la barre de recherche globale pour rechercher dans les projets, tâches, et documents RAG.
- [ ] **Modules Métiers (CRM & Finance) :** Développer les sections CRM et Finance (contacts, factures, devis).
- [ ] **Profil et Paramètres Utilisateur :** Enrichir la page des paramètres (profil, préférences de notification, connexions externes).

## 2. Technique (Qualité et Maintenabilité du Code)

- [x] **Centraliser les Constantes :** Extraire la liste des modèles LLM de `ModelSelector.tsx` dans `src/lib/constants/models.ts`. **(FAIT)**
- [x] **Refactor Contexte IA :** Extraire la logique du `pageContext` de `useProjectAIAgentLogic.ts` vers `src/utils/ai/getContext.ts`. **(FAIT)**
- [x] **Refactor "Tool Calls" IA :** Isoler la logique de traitement des `tool_calls` de `useProjectAIAgentLogic.ts` dans un service dédié (`src/services/aiToolHandler.ts`). **(FAIT)**
- [x] **Simplifier `useProjectAIAgentLogic.ts` :** S'assurer que le hook est plus court après les refactorisations. **(FAIT)**
- [ ] **Gestion d'État Centralisée :** Envisager Zustand ou un React Context pour les données globales (utilisateur, paramètres).
- [ ] **Gestion des Erreurs :** Utiliser systématiquement l'ErrorHandler pour une gestion uniforme.

## 3. Optimisation (Performance et Réactivité)

- [ ] **Chargement Paresseux (Lazy Loading) :** Utiliser `React.lazy` et `Suspense` pour le chargement des pages.
- [ ] **Mises à Jour Optimistes :** Implémenter des mises à jour optimistes pour les actions fréquentes (création de tâches).
- [ ] **Memoization :** Utiliser `React.memo` et `useCallback` pour optimiser les rendus inutiles.

## 4. Visuel (Design et Cohérence de l'UI)

- [ ] **Animer l'Agent IA :** Ajouter des transitions fluides (`framer-motion`) pour l'ouverture/fermeture du chat IA.
- [ ] **Skeletons de Chargement :** Remplacer les indicateurs de chargement par des squelettes UI.
- [ ] **États Vides (Empty States) :** Améliorer les écrans sans contenu avec des illustrations et des appels à l'action.
- [ ] **Thème Sombre/Clair :** Assurer la cohérence des deux thèmes.

## 5. Ergonomie (Expérience Utilisateur - UX)

- [ ] **Agent IA Proactif :** Rendre l'agent plus proactif avec des messages d'accueil contextuels.
- [ ] **Raccourcis Clavier :** Intégrer des raccourcis (`Cmd+K` pour la recherche, `N` pour créer).
