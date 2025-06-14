
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MCPConnectionForm from './MCPConnectionForm';
import MCPConnectionsList from './MCPConnectionsList';
import { useMcpConnections, McpConnection } from '@/hooks/supabase/useMcpConnections';

const MCPDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { connections, isLoading, addConnection, refreshConnections } = useMcpConnections();

  const handleAddConnection = async (connection: Omit<McpConnection, 'id' | 'created_at' | 'user_id' | 'status' | 'updated_at'>) => {
    const newConnection = await addConnection(connection.name, connection.url, connection.description);
    if (newConnection) {
      setActiveTab("connections");
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
                connectionsList={connections} 
                isLoading={isLoading} 
                onRefresh={refreshConnections}
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
              <MCPConnectionForm onConnectionSubmit={handleAddConnection} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MCPDashboard;
