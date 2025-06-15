import React from 'react';
import { Users, Clock, Plug, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import InteractiveChart from '@/components/enhanced-dashboard/InteractiveChart';
import EnhancedActivityFeed from '@/components/enhanced-dashboard/EnhancedActivityFeed';

// Mock data for charts
const taskData = [
  { name: 'Lun', value: 12 },
  { name: 'Mar', value: 19 },
  { name: 'Mer', value: 8 },
  { name: 'Jeu', value: 15 },
  { name: 'Ven', value: 22 },
  { name: 'Sam', value: 5 },
  { name: 'Dim', value: 3 },
];

const DashboardOverview: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <EnhancedCard
          className="glass-card"
          title="Tâches en attente"
          subtitle="Business et personnel"
          icon={<Clock className="h-5 w-5" />}
          hover
          interactive
        >
          <div className="text-2xl font-bold">0</div>
          <ProgressIndicator
            label="Progression hebdomadaire"
            value={7}
            max={10}
            color="success"
            className="mt-3"
          />
        </EnhancedCard>
        
        <EnhancedCard
          className="glass-card"
          title="MCPs connectés"
          subtitle="Connectez vos outils préférés"
          icon={<Plug className="h-5 w-5" />}
          hover
          interactive
        >
          <div className="text-2xl font-bold">2</div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">OpenRouter, Strava</span>
          </div>
        </EnhancedCard>
        
        <EnhancedCard
          className="glass-card"
          title="Évènements aujourd'hui"
          subtitle="Réunions et rendez-vous"
          icon={<Users className="h-5 w-5" />}
          hover
          interactive
        >
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-muted-foreground mt-1">
            Prochaine réunion dans 2h
          </div>
        </EnhancedCard>
        
        <EnhancedCard
          className="glass-card"
          title="Documents RAG"
          subtitle="Base de connaissances"
          icon={<Database className="h-5 w-5" />}
          hover
          interactive
        >
          <div className="text-2xl font-bold">15</div>
          <ProgressIndicator
            label="Capacité utilisée"
            value={15}
            max={100}
            color="warning"
            className="mt-3"
          />
        </EnhancedCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InteractiveChart
          className="glass-card"
          title="Activité des tâches"
          data={taskData}
          dataKey="value"
          color="#3b82f6"
          category="Productivité"
        />
        <EnhancedActivityFeed className="glass-card" />
      </div>
    </>
  );
};

export default DashboardOverview;
