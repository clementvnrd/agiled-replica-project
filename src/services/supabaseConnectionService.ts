// Désactivé : logique multi-instance Supabase (connexion individuelle)
// Tout ce fichier est désactivé, remplacé par le client global partagé (voir src/lib/supabaseClient.ts)
/*
import { createDynamicSupabaseClient } from '@/lib/createDynamicSupabaseClient';
import type { SupabaseCredentialsFormValues } from '@/lib/schemas/supabaseCredentialsSchema';
import { ErrorHandler } from '@/utils/errorHandler';

export type ConnectionTestStatus = 'idle' | 'testing' | 'success' | 'error';

/**
 * Tests a Supabase connection with the provided credentials
 * 
 * @param values The Supabase credentials to test
 * @returns An object with the test result and any error message
 */
export async function testSupabaseConnection(values: SupabaseCredentialsFormValues): Promise<{
  success: boolean;
  errorMessage: string | null;
}> {
  try {
    // Création d'un client temporaire pour tester
    const testClient = createDynamicSupabaseClient({
      supabaseUrl: values.supabaseUrl,
      supabaseAnonKey: values.supabaseAnonKey
    });
    
    if (!testClient) {
      throw new Error("Impossible de créer un client Supabase avec les credentials fournis.");
    }
    
    // Test simple en utilisant l'API auth qui est toujours disponible
    const { error: authError } = await testClient.auth.getSession();
    
    // Nous ignorons les erreurs liées à l'absence de session ou à l'expiration du JWT,
    // car elles indiquent que l'API auth fonctionne correctement
    if (authError && authError.message && 
        !authError.message.includes('No session found') && 
        !authError.message.includes('JWT expired')) {
      throw new Error(authError.message);
    }
    
    // Si on arrive ici sans erreur fatale, les credentials semblent valides
    return { success: true, errorMessage: null };
  } catch (err: any) {
    ErrorHandler.handleError(err, 'Erreur de test connexion');
    return { 
      success: false, 
      errorMessage: err.message || 'Impossible de se connecter à Supabase avec ces credentials' 
    };
  }
}
*/
