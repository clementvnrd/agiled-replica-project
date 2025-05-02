
import React from 'react';
import { Clipboard, Clock, FolderOpen, Calendar } from 'lucide-react';
import EmptyCard from '@/components/EmptyCard';
import TasksPerformanceCard from '@/components/TasksPerformanceCard';
import StatCardGroup from '@/components/dashboard/StatCardGroup';
import type { StatItem } from '@/components/dashboard/StatCardGroup';

const ProductivityDashboard: React.FC = () => {
  const productivityStats: StatItem[] = [
    {
      title: "Projets actifs",
      value: "0",
      icon: <FolderOpen size={18} className="text-blue-600" />
    },
    {
      title: "Tâches en cours",
      value: "0",
      icon: <Clipboard size={18} className="text-green-600" />,
      iconBg: "bg-green-100"
    },
    {
      title: "Heures loguées",
      value: "0h",
      icon: <Clock size={18} className="text-purple-600" />,
      iconBg: "bg-purple-100"
    },
    {
      title: "Évènements à venir",
      value: "0",
      icon: <Calendar size={18} className="text-orange-600" />,
      iconBg: "bg-orange-100"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Productivité</h1>
        <p className="text-agiled-lightText">Gérez vos projets, tâches et suivez votre temps</p>
      </div>
      
      <StatCardGroup items={productivityStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TasksPerformanceCard />
        <EmptyCard
          title="Traqueur de temps"
          message="Commencez à suivre votre temps sur les projets et tâches."
          icon={<Clock size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmptyCard
          title="Projets récents"
          message="Aucun projet pour le moment."
          icon={<FolderOpen size={24} />}
        />
        <EmptyCard
          title="Tâches à faire"
          message="Aucune tâche pour le moment."
          icon={<Clipboard size={24} />}
        />
        <EmptyCard
          title="Calendrier des évènements"
          message="Aucun évènement pour le moment."
          icon={<Calendar size={24} />}
        />
      </div>
    </div>
  );
};

export default ProductivityDashboard;
