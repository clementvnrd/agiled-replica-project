
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart } from '@/components/ui/chart';
import { useUser } from '@clerk/clerk-react';
import { useDynamicSupabase } from '@/providers/DynamicSupabaseProvider';
import MCPConnectionsList from './MCPConnectionsList';
import MCPConnectionForm from './MCPConnectionForm';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

const MCPDashboard: React.FC = () => {
  const { user } = useUser();
  const { supabase } = useDynamicSupabase();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const connectionsByTypeData: ChartData = {
    labels: ['Calendar', 'Payment', 'E-commerce', 'Fitness', 'AI', 'CRM'],
    datasets: [
      {
        label: 'Connections by Type',
        data: [2, 1, 1, 0, 1, 0],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  const usageData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'API Calls',
        data: [12, 19, 13, 25, 22, 35],
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        backgroundColor: 'rgba(54, 162, 235, 0.1)'
      }
    ]
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">MCP Dashboard</h1>
        <p className="text-gray-600">
          Gérez et surveillez tous vos connecteurs Multi-Channel Provider
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="connections">Mes connecteurs</TabsTrigger>
            <TabsTrigger value="add">Ajouter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connecteurs par type</CardTitle>
                  <CardDescription>Répartition des connecteurs MCP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Chart
                      type="pie"
                      data={connectionsByTypeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right'
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des API</CardTitle>
                  <CardDescription>Nombre d'appels API sur 6 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Chart
                      type="line"
                      data={usageData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">Connecteurs actifs</p>
                      <p className="text-3xl font-bold text-green-700">5</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">Appels API (mois)</p>
                      <p className="text-3xl font-bold text-blue-700">142</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-purple-800 text-sm font-medium">Données synchro.</p>
                      <p className="text-3xl font-bold text-purple-700">2.4 GB</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-yellow-800 text-sm font-medium">Utilisateurs</p>
                      <p className="text-3xl font-bold text-yellow-700">1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <MCPConnectionsList userId={user?.id} supabase={supabase} />
          </TabsContent>
          
          <TabsContent value="add">
            <MCPConnectionForm userId={user?.id} supabase={supabase} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MCPDashboard;
