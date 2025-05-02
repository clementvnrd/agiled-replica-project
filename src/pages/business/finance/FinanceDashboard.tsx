
import React from 'react';
import { DollarSign, CreditCard, Receipt, PieChart } from 'lucide-react';
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

const FinanceDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Finance Dashboard</h1>
        <p className="text-agiled-lightText">Suivez vos finances, factures et paiements</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Facturé" 
          value="0 €" 
          icon={<Receipt size={18} className="text-blue-600" />}
        />
        <StatCard 
          title="Recevables" 
          value="0 €" 
          icon={<CreditCard size={18} className="text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Dépenses" 
          value="0 €" 
          icon={<DollarSign size={18} className="text-red-600" />}
          iconBg="bg-red-100"
        />
        <StatCard 
          title="Profit" 
          value="0 €" 
          icon={<PieChart size={18} className="text-purple-600" />}
          iconBg="bg-purple-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardChart 
          title="Recettes vs charges" 
          data={chartData} 
          dataKey="value"
          color="#3b82f6"
        />
        <DashboardChart 
          title="P&L" 
          data={chartData} 
          dataKey="value"
          color="#10b981"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EmptyCard
          title="Factures récentes"
          message="Aucune facture pour le moment."
          icon={<Receipt size={24} />}
        />
        <EmptyCard
          title="Paiements récents"
          message="Aucun paiement pour le moment."
          icon={<CreditCard size={24} />}
        />
        <EmptyCard
          title="Dépenses récentes"
          message="Aucune dépense pour le moment."
          icon={<DollarSign size={24} />}
        />
      </div>
    </div>
  );
};

export default FinanceDashboard;
