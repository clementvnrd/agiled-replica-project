
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { createDynamicSupabaseClient } from '@/lib/createDynamicSupabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SupabaseFormFields from './supabase/SupabaseFormFields';
import SupabaseConnectionTest from './supabase/SupabaseConnectionTest';

const formSchema = z.object({
  supabaseUrl: z.string()
    .url("L'URL doit être valide")
    .startsWith('https://', "L'URL doit commencer par https://")
    .nonempty("L'URL est requise"),
  supabaseAnonKey: z.string()
    .min(20, "La clé doit contenir au moins 20 caractères")
    .nonempty("La clé est requise")
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Formulaire pour saisir les credentials Supabase utilisateur.
 *
 * Args:
 *   onSave (function): Callback appelé avec { supabaseUrl, supabaseAnonKey }.
 *   onSkip (function): Callback appelé quand l'utilisateur clique sur "Connecter plus tard".
 *
 * Returns:
 *   JSX.Element
 */
const SupabaseCredentialsForm: React.FC<{ 
  onSave: (creds: { supabaseUrl: string; supabaseAnonKey: string }) => void;
  onSkip?: () => void;
  initialCredentials?: { supabaseUrl: string; supabaseAnonKey: string } | null;
}> = ({ onSave, onSkip, initialCredentials = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supabaseUrl: initialCredentials?.supabaseUrl || '',
      supabaseAnonKey: initialCredentials?.supabaseAnonKey || ''
    }
  });

  const testConnection = async (values: FormValues) => {
    setTestStatus('testing');
    setTestError(null);
    
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
      setTestStatus('success');
      return true;
    } catch (err: any) {
      console.error('Erreur de test connexion:', err);
      setTestStatus('error');
      setTestError(err.message || 'Impossible de se connecter à Supabase avec ces credentials');
      return false;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const isValid = await testConnection(values);
      
      if (isValid) {
        onSave({
          supabaseUrl: values.supabaseUrl,
          supabaseAnonKey: values.supabaseAnonKey
        });
      } else {
        // Si le test échoue, on ne passe pas les credentials au parent
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setIsSubmitting(false);
      setTestStatus('error');
      setTestError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
          Configuration Supabase
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={16} className="text-blue-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Ces informations sont disponibles dans votre projet Supabase sous "Settings &gt; API"</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Connectez votre projet à Supabase pour activer la fonctionnalité RAG, l'authentification, et plus encore.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <SupabaseFormFields form={form} />
            
            <SupabaseConnectionTest 
              status={testStatus} 
              errorMessage={testError} 
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 flex-1" 
                disabled={isSubmitting || testStatus === 'testing'}
              >
                {(isSubmitting || testStatus === 'testing') ? 'Test de connexion...' : 'Enregistrer'}
              </Button>
              
              {onSkip && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-1"
                  onClick={onSkip}
                >
                  Connecter plus tard
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupabaseCredentialsForm;
