
// Hook désactivé : la logique multi-instance Supabase (connexion individuelle) a été supprimée
// L'application utilise maintenant le client global partagé (voir src/lib/supabaseClient.ts)
// Plus besoin d'onboarding Supabase pour chaque utilisateur

export function useUserSupabaseCredentials() {
  return {
    credentials: null,
    loading: false,
    error: null,
    saveCredentials: async () => false,
    clearCredentials: () => {},
    getCredentials: async () => null
  };
}
