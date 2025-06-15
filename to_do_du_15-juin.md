
# "To Do" du 15 Juin

Liste des améliorations à apporter à l'application, basée sur l'audit du 15/06.

## Tâches

- [x] **1. Centraliser les constantes des modèles LLM :** Extraire la liste des modèles LLM de `ModelSelector.tsx` dans un fichier de constantes dédié (`src/lib/constants/models.ts`) pour faciliter la maintenance et la réutilisation. Mettre à jour les composants qui utilisent ces valeurs. **(FAIT)**
- [x] **2. Refactoriser la logique de contexte de l'agent IA :** Extraire la logique de génération du `pageContext` depuis `useProjectAIAgentLogic.ts` vers une fonction utilitaire dédiée (`src/utils/ai/getContext.ts`) pour alléger le hook. **(FAIT)**
- [ ] **3. Refactoriser la gestion des appels d'outils :** Isoler la logique complexe de traitement des `tool_calls` de `useProjectAIAgentLogic.ts` dans un service ou une fonction dédiée (`src/services/aiToolHandler.ts`) pour améliorer la lisibilité et la testabilité.
- [ ] **4. Animer l'apparition de l'agent IA :** Ajouter des transitions fluides (par exemple avec `framer-motion`) pour l'ouverture et la fermeture de la fenêtre de chat de l'agent IA dans `ProjectAIAgentUI.tsx`.
- [ ] **5. Simplifier `useProjectAIAgentLogic.ts` :** Après les refactorisations précédentes, s'assurer que le hook est significativement plus court et plus facile à comprendre. Proposer de le scinder davantage si nécessaire.
- [ ] **6. Améliorer la gestion des projets :** Ajouter la possibilité de voir le nombre de tâches par projet sur la page de liste des projets.
- [ ] **7. Mettre à jour les statistiques du tableau de bord :** Connecter les `StatCard` du `DashboardBusiness.tsx` aux données réelles des projets et des tâches.
