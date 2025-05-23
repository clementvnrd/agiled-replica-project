import React from 'react';
import { BookOpen, Activity, Clock } from 'lucide-react';
import EmptyCard from '@/components/EmptyCard';
import DashboardChart from '@/components/DashboardChart';
import StatCardGroup from '@/components/dashboard/StatCardGroup';
import type { StatItem } from '@/components/dashboard/StatCardGroup';

// Example data for charts
const activityData = [
  { name: 'Lun', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Mer', value: 0 },
  { name: 'Jeu', value: 0 },
  { name: 'Ven', value: 0 },
  { name: 'Sam', value: 0 },
  { name: 'Dim', value: 0 },
];

const DashboardPersonal: React.FC = () => {
  const personalStats: StatItem[] = [
    {
      title: "Heures d'étude",
      value: "0",
      icon: <BookOpen size={18} className="text-purple-600" />,
      iconBg: "bg-purple-100"
    },
    {
      title: "Activité fitness",
      value: "0 km",
      icon: <Activity size={18} className="text-teal-600" />,
      iconBg: "bg-teal-100"
    },
    {
      title: "Tasks personnelles",
      value: "0",
      icon: <Clock size={18} className="text-blue-600" />
    },
    {
      title: "Calories brûlées",
      value: "0",
      icon: <Activity size={18} className="text-red-600" />,
      iconBg: "bg-red-100"
    }
  ];

  return (
    <>
      <StatCardGroup items={personalStats} />
      
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
    </>
  );
};

export default DashboardPersonal;
