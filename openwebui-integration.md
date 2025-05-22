# Intégration Open WebUI – Plan & Journal

## Objectif
Intégrer Open WebUI (https://github.com/open-webui/open-webui) de façon profonde et brandée dans notre plateforme, tout en gardant la possibilité de rollback facilement et sans impacter le code existant.

---

## 1. Préparation & Documentation

### 1.1. Création de la documentation
- Ce fichier (`openwebui-integration.md`) sert de **journal de bord** pour toute l’intégration.
- Deux autres fichiers à créer :
  - `openwebui-architecture.md` : schéma d’architecture, points d’intégration, passage de données, auth, etc.
  - `openwebui-rollback.md` : procédure pour désinstaller proprement l’intégration.

### 1.2. Points de vigilance
- **Aucune modification invasive** dans le code existant.
- **Tout le code Open WebUI** doit être dans un dossier dédié (`packages/openwebui/` ou `apps/openwebui/`).
- **Un flag d’activation** (feature toggle) doit permettre d’activer/désactiver l’UI Open WebUI.
- **Rollback facile** : suppression du dossier + du flag + de la route = retour à l’état initial.

### 1.3. Journal de bord
- [ ] Création du dossier dédié pour Open WebUI
- [ ] Import du code source Open WebUI
- [ ] Ajout d’une route dédiée dans l’app (`/openwebui`)
- [ ] Ajout du flag d’activation
- [ ] Ajout de la mention "powered by Open WebUI"
- [ ] Tests d’intégration (UI, auth, API)
- [ ] Documentation de chaque étape
- [ ] Procédure de rollback testée

---

## 2. Liens utiles
- [Open WebUI GitHub](https://github.com/open-webui/open-webui)
- [Documentation Open WebUI](https://openwebui.com/)
- [Licence BSD-3-Clause](https://github.com/open-webui/open-webui/blob/main/LICENSE)

---

## 3. Historique des actions

*(Compléter à chaque étape)*

- 2024-07-09 : Création du plan d’intégration et du journal de bord.
