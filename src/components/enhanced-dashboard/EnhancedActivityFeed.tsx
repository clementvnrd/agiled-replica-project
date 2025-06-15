
import React from 'react';
import { ActivityFeed, ActivityItem } from '@/components/ui/activity-feed';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface EnhancedActivityFeedProps {
  className?: string;
}

const EnhancedActivityFeed: React.FC<EnhancedActivityFeedProps> = ({ className }) => {
  // Mock data - replace with real data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'task_completed',
      title: 'Tâche terminée',
      description: 'Révision du dashboard principal',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      user: 'Vous',
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'success'
    },
    {
      id: '2',
      type: 'agent_interaction',
      title: 'Interaction Agent IA',
      description: 'L\'agent a traité votre demande de recherche',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: <Info className="h-4 w-4" />,
      category: 'info'
    },
    {
      id: '3',
      type: 'mcp_connected',
      title: 'Nouveau MCP connecté',
      description: 'OpenRouter API configuré avec succès',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'success'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Rappel',
      description: 'Vérifier les connexions Supabase',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: <AlertCircle className="h-4 w-4" />,
      category: 'warning'
    }
  ];

  return (
    <EnhancedCard
      className={className}
      title="Activité récente"
      subtitle="Dernières actions et événements"
      icon={<Clock className="h-5 w-5" />}
      hover
    >
      <ActivityFeed activities={activities} maxItems={5} />
    </EnhancedCard>
  );
};

export default EnhancedActivityFeed;
