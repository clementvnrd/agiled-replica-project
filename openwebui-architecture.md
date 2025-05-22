# Architecture d’Intégration Open WebUI

## 1. Vue d’ensemble

- Open WebUI est intégré dans le dossier `packages/openwebui/` (ou `apps/openwebui/`).
- Une route dédiée (`/openwebui`) permet d’accéder à l’interface.
- Un flag d’activation permet d’afficher ou non l’UI Open WebUI.

## 2. Points d’intégration

- **Authentification** : (à compléter selon ton système, ex : SSO, JWT, etc.)
- **Passage de la clé API utilisateur** : (ex : via localStorage, context, ou API)
- **Connexion au RAG** : (ex : endpoints internes, hooks, etc.)
- **Branding** : logo, couleurs, mentions légales

## 3. Schéma d’architecture

[App principale] <-> [Open WebUI intégré] <-> [APIs LLM/RAG/Autres]
