
import React from 'react';
import { Activity, Flame, TrendingUp, Clock } from 'lucide-react';
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

const FitnessDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Fitness</h1>
        <p className="text-agiled-lightText">Suivez vos activités sportives et votre progression</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Activités cette semaine" 
          value="0" 
          icon={<Activity size={18} className="text-blue-600" />}
        />
        <StatCard 
          title="Calories brûlées" 
          value="0" 
          icon={<Flame size={18} className="text-red-600" />}
          iconBg="bg-red-100"
        />
        <StatCard 
          title="Distance parcourue" 
          value="0 km" 
          icon={<TrendingUp size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Temps d'activité" 
          value="0h" 
          icon={<Clock size={18} className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardChart 
          title="Activité hebdomadaire" 
          data={activityData} 
          dataKey="value"
          color="#ef4444"
        />
        <EmptyCard
          title="Connexion Strava"
          message="Connectez votre compte Strava pour importer automatiquement vos activités."
          icon={<Activity size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmptyCard
          title="Dernières activités"
          message="Vos activités sportives récentes apparaîtront ici."
          icon={<TrendingUp size={24} />}
        />
        <EmptyCard
          title="Objectifs fitness"
          message="Définissez des objectifs pour suivre votre progression."
          icon={<Flame size={24} />}
        />
        <EmptyCard
          title="Plan d'entraînement"
          message="Créez ou importez un plan d'entraînement personnalisé."
          icon={<Clock size={24} />}
        />
      </div>
    </div>
  );
};

export default FitnessDashboard;
