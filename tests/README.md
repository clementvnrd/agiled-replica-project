# Tests unitaires

Les tests unitaires sont placés dans ce dossier et suivent la structure du code source.

- Utilisez `vitest` pour lancer les tests :
  ```sh
  npx vitest run
  ```
- Chaque module/fonction doit avoir :
  - 1 test nominal
  - 1 test edge case
  - 1 test failure case

Exemple :
- `test_utils_lazyImport.test.tsx` : tests pour le helper d'import dynamique
- `test_utils_errorMessages.test.ts` : tests pour la centralisation des erreurs
