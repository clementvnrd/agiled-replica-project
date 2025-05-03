/**
 * Centralisation des messages d'erreur de l'application.
 * Permet de garantir la cohérence et la maintenabilité des erreurs.
 */

export const ERROR_MESSAGES = {
  UNKNOWN: 'Une erreur inconnue est survenue.',
  AUTH_REQUIRED: "L'authentification est requise.",
  INVALID_INPUT: 'Entrée invalide.',
  NOT_FOUND: 'Ressource non trouvée.',
  SUPABASE_ERROR: 'Erreur Supabase.',
  NETWORK: 'Erreur réseau. Veuillez réessayer.',
};
