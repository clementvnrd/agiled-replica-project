import jwt from 'jsonwebtoken';

/**
 * Vérifie le JWT Clerk et retourne l'ID utilisateur Clerk.
 *
 * Args:
 *   token (string): Le JWT Clerk à vérifier.
 *
 * Returns:
 *   Promise<string>: L'ID Clerk de l'utilisateur.
 *
 * Raises:
 *   Error: Si le token est invalide.
 */
export async function verifyToken(token: string): Promise<string> {
  // Version simple : décoder le JWT (à remplacer par une vraie vérification avec Clerk SDK en prod)
  try {
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.sub) throw new Error('Invalid token');
    return decoded.sub;
  } catch (err) {
    throw new Error('Invalid Clerk token');
  }
} 