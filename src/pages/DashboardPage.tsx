
import React from 'react';
import { Users, FolderOpen, UserCheck, Clock, FileText, Percent, ShieldCheck, AlertCircle, BookOpen, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DashboardChart from '@/components/DashboardChart';
import TasksPerformanceCard from '@/components/TasksPerformanceCard';
import EmptyCard from '@/components/EmptyCard';
import ViewAllLink from '@/components/ViewAllLink';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example data for charts
const revenueData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Bienvenue sur votre plateforme All-in-One</h1>
        <p className="text-agiled-lightText">Gérez votre business et votre vie personnelle en un seul endroit</p>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="personal">Personnel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tâches en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Business et personnel</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">MCPs connectés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Connectez vos outils préférés</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Évènements aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Réunions et rendez-vous</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Documents RAG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Base de connaissances</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EmptyCard
              title="Agent Manager"
              message="Connectez votre Agent IA pour gérer vos tâches et informations."
              icon={<Users size={24} />}
            />
            <EmptyCard
              title="Prochains évènements"
              message="Synchronisez votre calendrier pour voir vos évènements."
              icon={<Clock size={24} />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="business">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Total des clients" 
              value="0" 
              icon={<Users size={18} className="text-blue-600" />}
            />
            <StatCard 
              title="Nombre total de projets" 
              value="0" 
              icon={<FolderOpen size={18} className="text-green-600" />}
              iconBg="bg-green-100"
            />
            <StatCard 
              title="Tâches en attente" 
              value="0" 
              icon={<Clock size={18} className="text-green-600" />}
              iconBg="bg-green-100"
            />
            <StatCard 
              title="Factures impayées" 
              value="0" 
              icon={<FileText size={18} className="text-orange-600" />}
              iconBg="bg-orange-100"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TasksPerformanceCard />
            <DashboardChart 
              title="Recettes vs charges" 
              data={revenueData} 
              dataKey="value"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Heures d'étude" 
              value="0" 
              icon={<BookOpen size={18} className="text-purple-600" />}
              iconBg="bg-purple-100"
            />
            <StatCard 
              title="Activité fitness" 
              value="0 km" 
              icon={<Activity size={18} className="text-teal-600" />}
              iconBg="bg-teal-100"
            />
            <StatCard 
              title="Tasks personnelles" 
              value="0" 
              icon={<Clock size={18} className="text-blue-600" />}
            />
            <StatCard 
              title="Calories brûlées" 
              value="0" 
              icon={<Activity size={18} className="text-red-600" />}
              iconBg="bg-red-100"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EmptyCard
              title="Intégration Strava"
              message="Connectez Strava pour suivre vos activités sportives."
              icon={<Activity size={24} />}
            />
            <EmptyCard
              title="Planification d'études"
              message="Organisez vos sessions d'étude et suivez votre progression."
              icon={<BookOpen size={24} />}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Système RAG</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-agiled-lightText">
                <p className="mb-4">Votre système de Retrieval Augmented Generation (RAG) n'est pas encore configuré.</p>
                <button className="btn-primary">Configurer RAG</button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Connecteurs MCP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center text-agiled-lightText">
                <p className="mb-4">Connectez vos outils externes via MCP.</p>
                <button className="btn-primary">Ajouter connecteur</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-agiled-lightBorder text-center text-sm text-agiled-lightText">
        <p>© 2025 All-in-One Dashboard. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
