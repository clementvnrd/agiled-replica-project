import React from 'react';
import { Users, FolderOpen, Clock, FileText } from 'lucide-react';
import TasksPerformanceCard from '@/components/TasksPerformanceCard';
import DashboardChart from '@/components/DashboardChart';
import StatCardGroup from '@/components/dashboard/StatCardGroup';
import type { StatItem } from '@/components/dashboard/StatCardGroup';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';

// Example data for charts
const revenueData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

const DashboardBusiness: React.FC = () => {
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { tasks, isLoading: isLoadingTasks } = useTasks();

  const isLoading = isLoadingProjects || isLoadingTasks;

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[110px] rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-[350px] rounded-lg" />
          <Skeleton className="h-[350px] rounded-lg" />
        </div>
      </>
    );
  }

  const totalProjects = projects.length;
  const pendingTasks = tasks.filter(task => task.status !== 'done').length;
  const uniqueClients = new Set(projects.map(p => p.client).filter(Boolean));

  const businessStats: StatItem[] = [
    {
      title: "Total des clients",
      value: uniqueClients.size,
      icon: <Users size={18} className="text-blue-600" />
    },
    {
      title: "Nombre total de projets",
      value: totalProjects,
      icon: <FolderOpen size={18} className="text-green-600" />,
      iconBg: "bg-green-100"
    },
    {
      title: "Tâches en attente",
      value: pendingTasks,
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
