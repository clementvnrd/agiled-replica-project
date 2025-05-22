import { toast } from 'sonner';
import { ERROR_MESSAGES } from './errorMessages';

/**
 * Gestionnaire d'erreurs centralisé pour l'application.
 * 
 * Permet de gérer les erreurs de manière cohérente à travers l'application.
 * Facilite le logging, l'affichage et le traitement des erreurs.
 */
export class ErrorHandler {
  /**
   * Traite une erreur et affiche un toast approprié
   * 
   * @param error - L'erreur à traiter
   * @param context - Contexte supplémentaire pour le logging
   * @param showToast - Si true, affiche un toast d'erreur à l'utilisateur
   * @returns L'erreur formatée
   */
  static handleError(error: unknown, context: string = '', showToast: boolean = true): Error {
    const formattedError = this.formatError(error);
    
    // Log l'erreur avec le contexte
    console.error(`Error [${context}]:`, formattedError);
    
    // Affiche un toast si demandé
    if (showToast) {
      toast.error(formattedError.message || ERROR_MESSAGES.UNKNOWN);
    }
    
    return formattedError;
  }
  
  /**
   * Formate une erreur pour assurer la cohérence
   */
  private static formatError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return new Error(String(error.message));
    }
    
    return new Error(ERROR_MESSAGES.UNKNOWN);
  }
  
  /**
   * Méthode spécifique pour gérer les erreurs Supabase
   */
  static handleSupabaseError(error: unknown, operation: string): Error {
    const formattedError = this.formatError(error);
    const message = `Erreur Supabase (${operation}): ${formattedError.message || ERROR_MESSAGES.UNKNOWN}`;
    
    console.error(message, error);
    toast.error(message);
    
    return new Error(message);
  }
  
  /**
   * Méthode pour gérer les erreurs d'API
   */
  static handleApiError(error: unknown, endpoint: string): Error {
    const formattedError = this.formatError(error);
    const message = `Erreur API (${endpoint}): ${formattedError.message || ERROR_MESSAGES.NETWORK}`;
    
    console.error(message, error);
    toast.error(message);
    
    return new Error(message);
  }
  
  /**
   * Méthode pour les erreurs d'authentification
   */
  static handleAuthError(error: unknown): Error {
    const formattedError = this.formatError(error);
    const message = `Erreur d'authentification: ${formattedError.message || ERROR_MESSAGES.AUTH_REQUIRED}`;
    
    console.error(message, error);
    toast.error(message);
    
    return new Error(message);
  }
}
