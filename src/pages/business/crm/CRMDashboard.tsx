
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrmAccounts } from '@/hooks/crm/useCrmAccounts';
import { useCrmContacts } from '@/hooks/crm/useCrmContacts';
import { useCrmDeals } from '@/hooks/crm/useCrmDeals';
import { useCrmTickets } from '@/hooks/crm/useCrmTickets';
import { useCrmActivities } from '@/hooks/crm/useCrmActivities';
import { useCrmTodos } from '@/hooks/crm/useCrmTodos';
import { Building, Users, DollarSign, Ticket, Calendar, CheckSquare } from 'lucide-react';
import ProactiveAIAgent from '@/components/crm/ProactiveAIAgent';
import CrmTodoList from '@/components/crm/CrmTodoList';
import AISuggestionCards from '@/components/crm/AISuggestionCards';
import CrmFinanceIntegration from '@/components/crm/CrmFinanceIntegration';

const CRMDashboard: React.FC = () => {
  const { data: accounts } = useCrmAccounts();
  const { data: contacts } = useCrmContacts();
  const { data: deals } = useCrmDeals();
  const { data: tickets } = useCrmTickets();
  const { data: activities } = useCrmActivities();
  const { todos } = useCrmTodos();

  // Calculer les statistiques
  const totalRevenue = deals?.filter(deal => deal.stage === 'closed_won')
    .reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;

  const pendingTodos = todos.filter(todo => todo.status === 'pending');
  const completedTodos = todos.filter(todo => todo.status === 'completed');

  const stats = [
    {
      title: "Comptes",
      value: accounts?.length || 0,
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: "Contacts",
      value: contacts?.length || 0,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Deals",
      value: deals?.length || 0,
      icon: <DollarSign className="h-4 w-4" />,
      subtitle: `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalRevenue)} de revenus`,
    },
    {
      title: "Tickets",
      value: tickets?.length || 0,
      icon: <Ticket className="h-4 w-4" />,
    },
    {
      title: "Activités",
      value: activities?.length || 0,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Tâches",
      value: todos.length,
      icon: <CheckSquare className="h-4 w-4" />,
      subtitle: `${pendingTodos.length} en attente, ${completedTodos.length} terminées`,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard CRM</h1>
        <p className="text-agiled-lightText">Vue d'ensemble de votre activité commerciale</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grille principale avec intégration CRM-Finance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Analyse CRM-Finance - Prend toute la largeur sur mobile, 2 colonnes sur desktop */}
        <div className="lg:col-span-2">
          <CrmFinanceIntegration />
        </div>
        
        {/* To Do Liste - 1 colonne */}
        <div className="lg:col-span-1">
          <CrmTodoList />
        </div>
      </div>

      {/* Suggestions IA - Largeur complète */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Assistant IA - Suggestions Intelligentes</CardTitle>
          </CardHeader>
          <CardContent>
            <AISuggestionCards />
          </CardContent>
        </Card>
      </div>

      {/* Agent IA Proactif - En bas, largeur complète */}
      <div className="mt-6">
        <ProactiveAIAgent />
      </div>
    </div>
  );
};

export default CRMDashboard;
