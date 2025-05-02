
import React from 'react';
import { BookOpen, Clock, Calendar, Award } from 'lucide-react';
import StatCard from '@/components/StatCard';
import EmptyCard from '@/components/EmptyCard';
import DashboardChart from '@/components/DashboardChart';

const studyTimeData = [
  { name: 'Lun', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Mer', value: 0 },
  { name: 'Jeu', value: 0 },
  { name: 'Ven', value: 0 },
  { name: 'Sam', value: 0 },
  { name: 'Dim', value: 0 },
];

const StudiesDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Études</h1>
        <p className="text-agiled-lightText">Gérez vos études, planifiez vos sessions et suivez votre progression</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Heures d'étude" 
          value="0h" 
          icon={<Clock size={18} className="text-blue-600" />}
        />
        <StatCard 
          title="Sessions complétées" 
          value="0" 
          icon={<BookOpen size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Évènements académiques" 
          value="0" 
          icon={<Calendar size={18} className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="Objectifs atteints" 
          value="0" 
          icon={<Award size={18} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardChart 
          title="Temps d'étude hebdomadaire" 
          data={studyTimeData} 
          dataKey="value"
          color="#8b5cf6"
        />
        <EmptyCard
          title="Sujets d'étude"
          message="Ajoutez vos sujets d'étude pour organiser votre apprentissage."
          icon={<BookOpen size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmptyCard
          title="Sessions d'étude à venir"
          message="Planifiez vos prochaines sessions d'étude."
          icon={<Clock size={24} />}
        />
        <EmptyCard
          title="Assistant d'études IA"
          message="Utilisez l'IA pour vous aider dans vos études."
          icon={<BookOpen size={24} />}
        />
        <EmptyCard
          title="Flashcards et quiz"
          message="Créez des flashcards et des quiz pour réviser."
          icon={<Award size={24} />}
        />
      </div>
    </div>
  );
};

export default StudiesDashboard;
