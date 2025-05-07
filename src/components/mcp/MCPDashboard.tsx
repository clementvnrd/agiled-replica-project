
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/clerk-react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import MCPConnectionForm from './MCPConnectionForm';
import MCPConnectionsList from './MCPConnectionsList';

interface MCPConnection {
  id: string;
  name: string;
  url: string;
  status: string;
  description?: string;
  created_at: string;
}

const MCPDashboard: React.FC = () => {
  const { user } = useUser();
  const { dynamicSupabase } = useDynamicSupabase();
  const [connections, setConnections] = useState<MCPConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const fetchConnections = async () => {
    if (!dynamicSupabase || !user) return;
    
    try {
      setLoading(true);
      const { data, error } = await dynamicSupabase
        .from('mcp_connections')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setConnections(data || []);
    } catch (err) {
      console.error('Failed to fetch MCP connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [dynamicSupabase, user]);

  const handleAddConnection = async (connection: Omit<MCPConnection, 'id' | 'created_at'>) => {
    if (!dynamicSupabase || !user) return;
    
    try {
      const { data, error } = await dynamicSupabase
        .from('mcp_connections')
        .insert([
          { 
            ...connection, 
            user_id: user.id 
          }
        ])
        .select('*')
        .single();
      
      if (error) throw error;
      
      setConnections(prev => [...prev, data as MCPConnection]);
      setActiveTab("connections");
    } catch (err) {
      console.error('Failed to add MCP connection:', err);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Gestionnaire MCP</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="connections">Connexions</TabsTrigger>
          <TabsTrigger value="new">Nouvelle Connexion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connexions MCP</CardTitle>
                <CardDescription>
                  Gérez vos connexions aux serveurs MCP.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Vous avez actuellement {connections.length} connexion(s) configurée(s).
                </p>
                <Button 
                  onClick={() => setActiveTab("new")} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ajouter une connexion
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Qu'est-ce qu'un MCP?</CardTitle>
                <CardDescription>
                  Multi-Purpose Computation Provider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les serveurs MCP (Multi-Purpose Computation Provider) sont des services qui fournissent
                  des capacités de calcul et d'accès aux données pour votre agent IA. Ils peuvent se connecter à
                  différents services comme Google Calendar, Notion, ou des API métier spécifiques.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Mes Connexions</CardTitle>
              <CardDescription>
                Liste de vos connexions aux serveurs MCP configurés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MCPConnectionsList 
                connections={connections} 
                loading={loading} 
                onRefresh={fetchConnections}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => setActiveTab("new")} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ajouter une connexion
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Connexion MCP</CardTitle>
              <CardDescription>
                Configurez une nouvelle connexion à un serveur MCP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MCPConnectionForm onSubmit={handleAddConnection} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MCPDashboard;
