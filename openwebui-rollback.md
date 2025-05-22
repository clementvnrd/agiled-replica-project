# Procédure de Rollback – Intégration Open WebUI

## Objectif

Permettre de désinstaller Open WebUI proprement, sans casser le code existant.

---

## 1. Suppression du code

- Supprimer le dossier `packages/openwebui/` (ou `apps/openwebui/`).
- Supprimer la route `/openwebui` dans le routeur principal.
- Supprimer le flag d’activation (feature toggle) dans la config.

## 2. Nettoyage des dépendances

- Supprimer toute dépendance ajoutée uniquement pour Open WebUI (npm, pnpm, etc.).
- Vérifier le `package.json` et le lockfile.

## 3. Vérification

- Relancer l’app et vérifier que tout fonctionne comme avant.
- Vérifier qu’aucun import ou appel à Open WebUI ne subsiste.

## 4. Historique

- Documenter la date et la raison du rollback ici.

---

## 5. Conseils

- Toujours faire un commit avant d’intégrer ou de rollbacker.
- Tester sur une branche dédiée avant de merger sur `main`.
