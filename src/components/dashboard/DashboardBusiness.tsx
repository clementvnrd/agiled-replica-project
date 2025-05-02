
import React from 'react';
import { Users, FolderOpen, Clock, FileText } from 'lucide-react';
import TasksPerformanceCard from '@/components/TasksPerformanceCard';
import DashboardChart from '@/components/DashboardChart';
import StatCardGroup from './StatCardGroup';
import type { StatItem } from './StatCardGroup';

// Example data for charts
const revenueData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

const DashboardBusiness: React.FC = () => {
  const businessStats: StatItem[] = [
    {
      title: "Total des clients",
      value: "0",
      icon: <Users size={18} className="text-blue-600" />
    },
    {
      title: "Nombre total de projets",
      value: "0",
      icon: <FolderOpen size={18} className="text-green-600" />,
      iconBg: "bg-green-100"
    },
    {
      title: "Tâches en attente",
      value: "0",
      icon: <Clock size={18} className="text-green-600" />,
      iconBg: "bg-green-100"
    },
    {
      title: "Factures impayées",
      value: "0",
      icon: <FileText size={18} className="text-orange-600" />,
      iconBg: "bg-orange-100"
    }
  ];

  return (
    <>
      <StatCardGroup items={businessStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TasksPerformanceCard />
        <DashboardChart 
          title="Recettes vs charges" 
          data={revenueData} 
          dataKey="value"
        />
      </div>
    </>
  );
};

export default DashboardBusiness;
