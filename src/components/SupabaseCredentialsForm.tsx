
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, AlertTriangle, Info } from 'lucide-react';
import { createDynamicSupabaseClient } from '@/lib/createDynamicSupabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
 *
 * Returns:
 *   JSX.Element
 */
const SupabaseCredentialsForm: React.FC<{ 
  onSave: (creds: { supabaseUrl: string; supabaseAnonKey: string }) => void;
  initialCredentials?: { supabaseUrl: string; supabaseAnonKey: string } | null;
}> = ({ onSave, initialCredentials = null }) => {
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
      
      // Test simple pour vérifier si les credentials sont valides
      const { error } = await testClient.from('rag_documents').select('count()', { count: 'exact', head: true });
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(error.message);
      }

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
      }
    } finally {
      setIsSubmitting(false);
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
            <FormField
              control={form.control}
              name="supabaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">URL Supabase</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://xxx.supabase.co" 
                      {...field} 
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    L'URL de votre projet Supabase (se termine par .supabase.co)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supabaseAnonKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Clé anonyme (anon key)</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="eyJ0eXAiOi..." 
                      {...field}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    La clé anonyme de votre projet Supabase (commence par eyJ...)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {testStatus === 'error' && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Erreur de connexion</p>
                  <p>{testError || "Impossible de se connecter à Supabase avec ces credentials"}</p>
                </div>
              </div>
            )}

            {testStatus === 'success' && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-800 flex items-start gap-2">
                <Check className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold">Connexion réussie</p>
                  <p>Les credentials sont valides et la connexion à Supabase est établie.</p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isSubmitting || testStatus === 'testing'}
            >
              {(isSubmitting || testStatus === 'testing') ? 'Test de connexion...' : 'Enregistrer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupabaseCredentialsForm;
