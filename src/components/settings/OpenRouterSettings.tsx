
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';

const OpenRouterSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Récupérer la clé API stockée au chargement du composant
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('openrouter_api_key')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // Ignorer l'erreur si le profil n'est pas trouvé
            throw error;
          }

          if (profile?.openrouter_api_key) {
            setApiKey(profile.openrouter_api_key);
            setIsConfigured(true);
          }
        } else {
          toast.error("Veuillez vous connecter pour configurer OpenRouter.");
        }
      } catch (e) {
        ErrorHandler.handleError(e, 'Erreur lors de la récupération des informations utilisateur');
        toast.error('Erreur de chargement de la configuration.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fonction pour valider la clé API OpenRouter
  const validateApiKey = async (key: string): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      
      const success = response.ok;
      
      if (!success) {
        toast.error('Clé API OpenRouter invalide');
      }
      
      return success;
    } catch (error) {
      ErrorHandler.handleError(error, 'Erreur lors de la validation de la clé API');
      toast.error('Erreur de connexion à OpenRouter');
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
    
    if (!userId) {
      toast.error("Utilisateur non authentifié. Veuillez vous reconnecter.");
      return;
    }

    setIsLoading(true);
    
    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ openrouter_api_key: apiKey })
          .eq('id', userId);

        if (error) throw error;
        
        setIsConfigured(true);
        toast.success('Clé API OpenRouter sauvegardée avec succès');
      } catch (e) {
        ErrorHandler.handleError(e, 'Erreur lors de la sauvegarde de la clé API');
        toast.error('Erreur lors de la sauvegarde');
      }
    }
    
    setIsLoading(false);
  };

  const handleRemove = async () => {
    if (!userId) {
      toast.error('Utilisateur non authentifié.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ openrouter_api_key: null })
        .eq('id', userId);
      
      if (error) throw error;
      
      setApiKey('');
      setIsConfigured(false);
      toast.success('Clé API OpenRouter supprimée');
    } catch (e) {
      ErrorHandler.handleError(e, 'Erreur lors de la suppression de la clé API');
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration OpenRouter</CardTitle>
        <CardDescription>
          Connectez votre compte OpenRouter pour utiliser les modèles LLM avancés
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
              <label className="block text-sm font-medium mb-1">Clé API OpenRouter</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full"
                disabled={!userId}
              />
              {isConfigured && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Configuration OpenRouter active
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>Pour obtenir votre clé API:</p>
              <ol className="list-decimal pl-5 mt-1 space-y-1">
                <li>Créez un compte sur <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenRouter.ai</a></li>
                <li>Accédez à votre tableau de bord</li>
                <li>Créez une nouvelle clé API</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConfigured ? (
          <>
            <Button onClick={handleRemove} variant="destructive" disabled={isLoading || isValidating || !userId}>
              Supprimer la clé
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isValidating || !apiKey.trim() || !userId}>
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
          <Button onClick={handleSave} className="w-full" disabled={isLoading || isValidating || !apiKey.trim() || !userId}>
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

export default OpenRouterSettings;
