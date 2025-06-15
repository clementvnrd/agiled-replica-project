
import React from 'react';
import { Users, Building, DollarSign, PieChart, Activity } from 'lucide-react';
import DashboardChart from '@/components/DashboardChart';
import StatCardGroup from '@/components/dashboard/StatCardGroup';
import type { StatItem } from '@/components/dashboard/StatCardGroup';
import { useCrmAccounts } from '@/hooks/crm/useCrmAccounts';
import { useCrmContacts } from '@/hooks/crm/useCrmContacts';
import { useCrmDeals } from '@/hooks/crm/useCrmDeals';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const chartData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
];

const CRMDashboard: React.FC = () => {
  const { data: accounts, isLoading: isLoadingAccounts } = useCrmAccounts();
  const { data: contacts, isLoading: isLoadingContacts } = useCrmContacts();
  const { data: deals, isLoading: isLoadingDeals } = useCrmDeals();

  const isLoading = isLoadingAccounts || isLoadingContacts || isLoadingDeals;

  const totalRevenue = deals
    ?.filter(deal => deal.stage === 'won' && deal.value)
    .reduce((sum, deal) => sum + Number(deal.value || 0), 0) || 0;

  const crmStats: StatItem[] = [
    {
      title: "Comptes",
      value: isLoading ? "..." : (accounts?.length ?? 0).toString(),
      icon: <Building size={18} className="text-blue-600" />
    },
    {
      title: "Contacts",
      value: isLoading ? "..." : (contacts?.length ?? 0).toString(),
      icon: <Users size={18} className="text-green-600" />,
      iconBg: "bg-green-100"
    },
    {
      title: "Deals",
      value: isLoading ? "..." : (deals?.length ?? 0).toString(),
      icon: <DollarSign size={18} className="text-purple-600" />,
      iconBg: "bg-purple-100"
    },
    {
      title: "Revenu",
      value: isLoading ? "..." : `${totalRevenue.toLocaleString('fr-FR')} €`,
      icon: <PieChart size={18} className="text-orange-600" />,
      iconBg: "bg-orange-100"
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <StatCardGroup items={crmStats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    )
  }
  
  const latestDeals = deals?.slice(0, 5) ?? [];
  const latestContacts = contacts?.slice(0, 5) ?? [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">CRM Dashboard</h1>
        <p className="text-agiled-lightText">Gérez vos relations clients, contacts et opportunités</p>
      </div>
      
      <StatCardGroup items={crmStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <DollarSign size={16} /> Derniers deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestDeals.length > 0 ? (
              <ul className="space-y-3 text-sm">
                {latestDeals.map(deal => (
                  <li key={deal.id} className="flex justify-between items-center">
                    <span>{deal.name}</span>
                    <span className="font-medium text-muted-foreground">{deal.value ? `${Number(deal.value).toLocaleString('fr-FR')} €` : ''}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4 text-sm">Aucun deal pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Users size={16} /> Derniers contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestContacts.length > 0 ? (
               <ul className="space-y-3 text-sm">
                {latestContacts.map(contact => (
                  <li key={contact.id} className="flex items-center justify-between">
                    <span>{contact.name}</span>
                    <span className="text-muted-foreground">{contact.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4 text-sm">Aucun contact pour le moment.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity size={16} /> Activités récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-4 text-sm">Le suivi des activités sera bientôt disponible.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMDashboard;
