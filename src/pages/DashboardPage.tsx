
import React from 'react';
import { Users, FolderOpen, UserCheck, Clock, FileText, Percent, ShieldCheck, AlertCircle } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DashboardChart from '@/components/DashboardChart';
import DashboardTable from '@/components/DashboardTable';
import TasksPerformanceCard from '@/components/TasksPerformanceCard';
import EmptyCard from '@/components/EmptyCard';
import ViewAllLink from '@/components/ViewAllLink';

// Example data for charts
const revenueData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

const DashboardPage: React.FC = () => {
  // Example columns for tables
  const todosColumns = [
    { key: 'title', label: 'Title' },
    { key: 'project', label: 'Project' },
    { key: 'assignee', label: 'Assignee' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status' },
  ];
  
  const projectsColumns = [
    { key: 'name', label: 'Name' },
    { key: 'client', label: 'Client' },
    { key: 'members', label: 'Members' },
    { key: 'progress', label: 'Progress' },
    { key: 'dueDate', label: 'Due Date' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Hi, Clément</h1>
        <p className="text-agiled-lightText">Here's what's happening with your business today</p>
      </div>
      
      {/* Top Stats */}
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
          title="Total des employés" 
          value="0" 
          icon={<UserCheck size={18} className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="PENDING TASKS" 
          value="0" 
          icon={<Clock size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
      </div>
      
      {/* Middle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Heures enregistrées" 
          value="0" 
          icon={<Clock size={18} className="text-blue-600" />}
        />
        <StatCard 
          title="Factures impayées" 
          value="0" 
          icon={<FileText size={18} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
        <StatCard 
          title="Présence aujourd'hui" 
          value="0" 
          icon={<Percent size={18} className="text-teal-600" />}
          iconBg="bg-teal-100"
        />
        <StatCard 
          title="Tickets non résolus" 
          value="0" 
          icon={<AlertCircle size={18} className="text-red-600" />}
          iconBg="bg-red-100"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TasksPerformanceCard />
        <DashboardChart 
          title="Recettes vs charges" 
          data={revenueData} 
          dataKey="value"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <DashboardChart 
          title="Profit & Loss" 
          data={revenueData} 
          dataKey="value"
          color="#10b981"
        />
      </div>
      
      {/* New Tickets */}
      <div className="grid grid-cols-1 mb-6">
        <div className="agiled-card">
          <h3 className="text-lg font-medium mb-4">Nouveaux tickets</h3>
          <div className="py-6 text-center text-agiled-lightText">
            Aucune tâche ouverte.
          </div>
          <ViewAllLink to="/tasks" />
        </div>
      </div>
      
      {/* Active Projects & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="agiled-card h-full">
            <h3 className="text-lg font-medium mb-4">Projets actifs</h3>
            <div className="py-6 text-center text-agiled-lightText">
              No Projects
            </div>
            <ViewAllLink to="/projects" />
          </div>
        </div>
        <div>
          <EmptyCard
            title="Annonce"
            message="No Announcements Yet."
            icon={<Users size={24} />}
          />
        </div>
      </div>
      
      {/* Calendars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="agiled-card">
            <h3 className="text-lg font-medium mb-4">Calendrier des activités du projet</h3>
            <div className="flex items-center mb-4">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-agiled-lightText">0 days ago</span>
            </div>
            <div className="py-6 text-center text-agiled-lightText flex items-center justify-center">
              <Calendar size={20} className="mr-2" />
              No project activity found.
            </div>
          </div>
        </div>
        <div>
          <div className="agiled-card">
            <h3 className="text-lg font-medium mb-4">Calendrier des activités de l'utilisateur</h3>
            <div className="py-6 px-4">
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-agiled-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                  C
                </div>
                <div>
                  <div className="font-medium">Clément <span className="text-xs text-agiled-lightText">il y a 1 jour</span></div>
                  <div className="text-sm">Updated profile.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-agiled-lightBorder text-center text-sm text-agiled-lightText">
        <div className="flex justify-center space-x-4 mb-2">
          <a href="#" className="hover:underline">Help & Support</a>
          <a href="#" className="hover:underline">Contact Us</a>
          <a href="#" className="hover:underline">Become a Reseller</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
        <p>2025 © Agiled. All rights reserved.</p>
      </div>
      
      {/* Sticky Notes (Fixed position) */}
      <div className="fixed bottom-0 right-0 w-72 bg-gray-800 text-white">
        <div className="p-3 flex justify-between items-center">
          <h3 className="font-medium">Sticky Notes</h3>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
        <div className="p-3 border-t border-gray-700">
          <button className="bg-blue-500 hover:bg-blue-600 w-full py-2 px-4 rounded-md text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Ajouter une note
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for Calendar icon
const Calendar = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default DashboardPage;
