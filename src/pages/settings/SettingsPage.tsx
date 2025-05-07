
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSupabaseCredentials } from '@/hooks/useUserSupabaseCredentials';
import SupabaseCredentialsForm from '@/components/SupabaseCredentialsForm';
import OpenRouterSettings from '@/components/settings/OpenRouterSettings';
import MCPManager from '@/pages/settings/MCPManager';
import SupabaseStatusBadge from '@/components/supabase/SupabaseStatusBadge';
import { Button } from '@/components/ui/button';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { 
    credentials, 
    loading, 
    saveCredentials, 
    clearCredentials, 
    createUserSupabaseClient 
  } = useUserSupabaseCredentials();

  const supabaseClient = createUserSupabaseClient();
  const hasSupabaseCredentials = !!credentials?.supabaseUrl && !!credentials?.supabaseAnonKey;

  const handleSaveCredentials = (newCredentials: { supabaseUrl: string; supabaseAnonKey: string }) => {
    saveCredentials(newCredentials);
  };

  const handleClearCredentials = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer les identifiants Supabase ? Cette action est irréversible.')) {
      clearCredentials();
    }
  };

  const renderSupabaseStatus = () => {
    if (loading) {
      return <p className="text-gray-500">Chargement des informations de connexion...</p>;
    }

    return (
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">URL:</p>
          <p className="font-mono text-sm bg-gray-50 border px-2 py-1 rounded">
            {credentials?.supabaseUrl || 'Non configuré'}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-medium">Clé anonyme:</p>
          <p className="font-mono text-sm bg-gray-50 border px-2 py-1 rounded">
            {credentials?.supabaseAnonKey 
              ? `${credentials.supabaseAnonKey.substring(0, 8)}...` 
              : 'Non configurée'}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-medium">Statut:</p>
          <SupabaseStatusBadge status={!!supabaseClient} />
        </div>

        {hasSupabaseCredentials && (
          <div className="flex justify-end mt-2 gap-2">
            <Button 
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50" 
              onClick={handleClearCredentials}
            >
              Supprimer les credentials
            </Button>

            <Button 
              variant="outline"
              onClick={() => setActiveTab('supabase-update')}
            >
              Modifier les credentials
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="supabase" disabled={loading}>Supabase</TabsTrigger>
          <TabsTrigger value="openRouter">OpenRouter</TabsTrigger>
          <TabsTrigger value="mcp">MCP</TabsTrigger>
          {hasSupabaseCredentials && (
            <TabsTrigger value="supabase-update" className="hidden">Modifier Supabase</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Options générales de l'application (à venir)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle>Connexion Supabase</CardTitle>
              <CardDescription>
                Configuration de votre connexion à Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSupabaseStatus()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openRouter">
          <OpenRouterSettings />
        </TabsContent>

        <TabsContent value="mcp">
          <MCPManager />
        </TabsContent>

        {hasSupabaseCredentials && (
          <TabsContent value="supabase-update">
            <Card>
              <CardHeader>
                <CardTitle>Modifier les credentials Supabase</CardTitle>
                <CardDescription>
                  Mettez à jour les informations de connexion à votre projet Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupabaseCredentialsForm 
                  onSave={handleSaveCredentials} 
                  initialCredentials={credentials}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('supabase')}
                >
                  Retour
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
