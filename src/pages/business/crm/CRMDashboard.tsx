
import React from 'react';
import { Users, Building, DollarSign, PieChart } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DashboardChart from '@/components/DashboardChart';
import EmptyCard from '@/components/EmptyCard';

const chartData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

const CRMDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">CRM Dashboard</h1>
        <p className="text-agiled-lightText">Gérez vos relations clients, contacts et opportunités</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Comptes" 
          value="0" 
          icon={<Building size={18} className="text-blue-600" />}
        />
        <StatCard 
          title="Contacts" 
          value="0" 
          icon={<Users size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Deals" 
          value="0" 
          icon={<DollarSign size={18} className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="Revenu" 
          value="0 €" 
          icon={<PieChart size={18} className="text-orange-600" />}
          iconBg="bg-orange-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardChart 
          title="Entonnoir de ventes" 
          data={chartData} 
          dataKey="value"
          color="#3b82f6"
        />
        <DashboardChart 
          title="Leads par source" 
          data={chartData} 
          dataKey="value"
          color="#10b981"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmptyCard
          title="Derniers deals"
          message="Aucun deal pour le moment."
          icon={<DollarSign size={24} />}
        />
        <EmptyCard
          title="Derniers leads"
          message="Aucun lead pour le moment."
          icon={<Users size={24} />}
        />
        <EmptyCard
          title="Activités CRM récentes"
          message="Aucune activité pour le moment."
          icon={<Building size={24} />}
        />
      </div>
    </div>
  );
};

export default CRMDashboard;
