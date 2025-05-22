// Désactivé : logique multi-instance Supabase (connexion individuelle)
// Tout ce fichier est désactivé, remplacé par le client global partagé (voir src/lib/supabaseClient.ts)
/*
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SupabaseFormFields from './supabase/SupabaseFormFields';
import SupabaseConnectionTest from './supabase/SupabaseConnectionTest';
import { supabaseCredentialsSchema, type SupabaseCredentialsFormValues } from '@/lib/schemas/supabaseCredentialsSchema';
import { testSupabaseConnection, ConnectionTestStatus } from '@/services/supabaseConnectionService';

interface SupabaseCredentialsFormProps {
  onSave: (creds: SupabaseCredentialsFormValues) => void;
  onSkip?: () => void;
  initialCredentials?: SupabaseCredentialsFormValues | null;
}

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
const SupabaseCredentialsForm: React.FC<SupabaseCredentialsFormProps> = ({ 
  onSave, 
  onSkip, 
  initialCredentials = null 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStatus, setTestStatus] = useState<ConnectionTestStatus>('idle');
  const [testError, setTestError] = useState<string | null>(null);

  const form = useForm<SupabaseCredentialsFormValues>({
    resolver: zodResolver(supabaseCredentialsSchema),
    defaultValues: {
      supabaseUrl: initialCredentials?.supabaseUrl || '',
      supabaseAnonKey: initialCredentials?.supabaseAnonKey || ''
    }
  });

  const handleSubmit = async (values: SupabaseCredentialsFormValues) => {
    setIsSubmitting(true);
    setTestStatus('testing');
    setTestError(null);
    
    try {
      const { success, errorMessage } = await testSupabaseConnection(values);
      
      if (success) {
        setTestStatus('success');
        onSave(values);
      } else {
        setTestStatus('error');
        setTestError(errorMessage);
        setIsSubmitting(false);
      }
    } catch (error: any) {
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
*/
