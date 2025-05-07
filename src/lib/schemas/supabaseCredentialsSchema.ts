
import { z } from 'zod';

export const supabaseCredentialsSchema = z.object({
  supabaseUrl: z.string()
    .url("L'URL doit être valide")
    .startsWith('https://', "L'URL doit commencer par https://")
    .nonempty("L'URL est requise"),
  supabaseAnonKey: z.string()
    .min(20, "La clé doit contenir au moins 20 caractères")
    .nonempty("La clé est requise")
});

export type SupabaseCredentialsFormValues = z.infer<typeof supabaseCredentialsSchema>;
