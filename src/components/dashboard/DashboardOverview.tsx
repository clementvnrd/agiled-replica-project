
import React from 'react';
import { Users, Clock } from 'lucide-react';
import EmptyCard from '@/components/EmptyCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardOverview: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default DashboardOverview;
