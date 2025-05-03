
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AuthConfirmation from './AuthConfirmation';

const formSchema = z.object({
  email: z.string()
    .email("Adresse email invalide")
    .nonempty("L'email est requis"),
});

type FormValues = z.infer<typeof formSchema>;

const PasswordRecovery: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' }
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      
      if (resetError) throw new Error(resetError.message);
      
      setEmail(values.email);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Erreur récupération mot de passe:", err);
      setError(err.message || "Une erreur est survenue lors de l'envoi des instructions");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthConfirmation 
        type="password-reset" 
        email={email} 
        onResend={() => form.handleSubmit(handleSubmit)()}
        onBack={onBack}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Récupération de mot de passe</CardTitle>
        <CardDescription>
          Entrez votre email pour recevoir un lien de réinitialisation de mot de passe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="votre@email.com" 
                      type="email"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div className="text-sm">{error}</div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer les instructions'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="w-full"
          >
            Retour à la connexion
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PasswordRecovery;
