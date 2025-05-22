import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';

// Types pour le stockage des API keys
type StoredApiKeys = {
  openRouterApiKey?: string;
};

const OpenRouterSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Récupérer la clé API stockée au chargement du composant
  useEffect(() => {
    const storedKeys = localStorage.getItem('api_keys');
    if (storedKeys) {
      try {
        const parsed: StoredApiKeys = JSON.parse(storedKeys);
        if (parsed.openRouterApiKey) {
          setApiKey(parsed.openRouterApiKey);
          setIsConfigured(true);
        }
      } catch (e) {
        ErrorHandler.handleError(e, 'Erreur lors de la récupération des clés API');
      }
    }
  }, []);

  // Fonction pour valider la clé API OpenRouter
  const validateApiKey = async (key: string): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      // Tentative d'appel simple à OpenRouter pour valider la clé
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
    
    setIsLoading(true);
    
    // Valider la clé API
    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      // Sauvegarder la clé dans le localStorage
      try {
        const storedKeys = localStorage.getItem('api_keys');
        const keys: StoredApiKeys = storedKeys ? JSON.parse(storedKeys) : {};
        
        keys.openRouterApiKey = apiKey;
        localStorage.setItem('api_keys', JSON.stringify(keys));
        
        setIsConfigured(true);
        toast.success('Clé API OpenRouter sauvegardée avec succès');
      } catch (e) {
        ErrorHandler.handleError(e, 'Erreur lors de la sauvegarde de la clé API');
        toast.error('Erreur lors de la sauvegarde');
      }
    }
    
    setIsLoading(false);
  };

  const handleRemove = () => {
    // Supprimer la clé du localStorage
    try {
      const storedKeys = localStorage.getItem('api_keys');
      if (storedKeys) {
        const keys: StoredApiKeys = JSON.parse(storedKeys);
        delete keys.openRouterApiKey;
        localStorage.setItem('api_keys', JSON.stringify(keys));
      }
      
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Clé API OpenRouter</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full"
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
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConfigured ? (
          <>
            <Button onClick={handleRemove} variant="destructive">
              Supprimer la clé
            </Button>
            <Button onClick={handleSave} disabled={isLoading || isValidating || !apiKey.trim()}>
              {(isLoading || isValidating) ? (
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
            {(isLoading || isValidating) ? (
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
