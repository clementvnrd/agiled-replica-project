
import React from 'react';
import { BookOpen, Activity, Calendar, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import EmptyCard from '@/components/EmptyCard';
import DashboardChart from '@/components/DashboardChart';

const activityData = [
  { name: 'Lun', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Mer', value: 0 },
  { name: 'Jeu', value: 0 },
  { name: 'Ven', value: 0 },
  { name: 'Sam', value: 0 },
  { name: 'Dim', value: 0 },
];

const PersonalDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Vie Personnelle</h1>
        <p className="text-agiled-lightText">Gérez vos études, activités sportives et autres aspects personnels</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Sessions d'étude" 
          value="0" 
          icon={<BookOpen size={18} className="text-blue-600" />}
        />
        <StatCard 
          title="Activités sportives" 
          value="0" 
          icon={<Activity size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Évènements personnels" 
          value="0" 
          icon={<Calendar size={18} className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="Tâches personnelles" 
          value="0" 
          icon={<Clock size={18} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardChart 
          title="Activité hebdomadaire" 
          data={activityData} 
          dataKey="value"
          color="#10b981"
        />
        <EmptyCard
          title="Intégration Strava"
          message="Connectez votre compte Strava pour suivre vos activités sportives."
          icon={<Activity size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmptyCard
          title="Planning d'études"
          message="Créez votre planning d'études pour optimiser votre temps."
          icon={<BookOpen size={24} />}
        />
        <EmptyCard
          title="Évènements à venir"
          message="Synchronisez votre calendrier pour voir vos évènements."
          icon={<Calendar size={24} />}
        />
        <EmptyCard
          title="Tâches personnelles"
          message="Gérez vos tâches personnelles."
          icon={<Clock size={24} />}
        />
      </div>
    </div>
  );
};

export default PersonalDashboard;
