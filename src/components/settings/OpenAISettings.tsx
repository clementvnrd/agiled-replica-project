
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const OpenAISettings: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('openai_api_key')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // Ignore 'not found' error
          throw error;
        }

        if (profile?.openai_api_key) {
          setApiKey(profile.openai_api_key);
          setIsConfigured(true);
        }
      } catch (e) {
        ErrorHandler.handleError(e, 'Erreur lors de la récupération de la configuration OpenAI');
        toast.error('Erreur de chargement de la configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const validateApiKey = async (key: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      });
      const success = response.ok;
      if (!success) {
        toast.error('Clé API OpenAI invalide');
      }
      return success;
    } catch (error) {
      ErrorHandler.handleError(error, 'Erreur lors de la validation de la clé API');
      toast.error('Erreur de connexion à OpenAI');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Veuillez entrer une clé API');
      return;
    }
    if (!user) {
      toast.error("Utilisateur non authentifié. Veuillez vous reconnecter.");
      return;
    }

    setIsLoading(true);
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ openai_api_key: apiKey })
          .eq('id', user.id);

        if (error) throw error;
        
        setIsConfigured(true);
        toast.success('Clé API OpenAI sauvegardée avec succès');
      } catch (e) {
        ErrorHandler.handleError(e, 'Erreur lors de la sauvegarde de la clé API');
        toast.error('Erreur lors de la sauvegarde');
      }
    }
    setIsLoading(false);
  };

  const handleRemove = async () => {
    if (!user) {
      toast.error('Utilisateur non authentifié.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ openai_api_key: null })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setApiKey('');
      setIsConfigured(false);
      toast.success('Clé API OpenAI supprimée');
    } catch (e) {
      ErrorHandler.handleError(e, 'Erreur lors de la suppression de la clé API');
      toast.error('Erreur lors de la suppression');
    }
  };

  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuration OpenAI</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Veuillez vous connecter pour configurer votre clé API OpenAI.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration OpenAI</CardTitle>
        <CardDescription>
          Fournissez votre propre clé API OpenAI pour la création des embeddings de documents RAG.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Clé API OpenAI</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full"
              />
              {isConfigured && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Configuration OpenAI active
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>
                Si aucune clé n'est fournie, le système utilisera une clé par défaut (si configurée). 
                L'utilisation de votre propre clé est recommandée pour une utilisation en production.
              </p>
              <p className="mt-2">Pour obtenir votre clé API:</p>
              <ol className="list-decimal pl-5 mt-1 space-y-1">
                <li>Créez un compte sur <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.openai.com</a></li>
                <li>Accédez à la section "API keys" dans les paramètres</li>
                <li>Créez une nouvelle clé secrète</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConfigured ? (
          <>
            <Button onClick={handleRemove} variant="destructive" disabled={isLoading || isValidating}>
              Supprimer la clé
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isValidating || !apiKey.trim()}>
              {(isValidating) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </>
        ) : (
          <Button onClick={handleSave} className="w-full" disabled={isLoading || isValidating || !apiKey.trim()}>
            {(isValidating) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OpenAISettings;
