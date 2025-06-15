
import React, { useState, useEffect } from 'react';
import { Bot, Lightbulb, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCrmTodos, type CrmTodo } from '@/hooks/crm/useCrmTodos';
import { useCrmActivities } from '@/hooks/crm/useCrmActivities';
import { useCrmDeals } from '@/hooks/crm/useCrmDeals';
import { useCrmContacts } from '@/hooks/crm/useCrmContacts';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface AISuggestion {
  id: string;
  type: 'todo' | 'follow_up' | 'priority' | 'deadline';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
}

const ProactiveAIAgent: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { todos, createTodo } = useCrmTodos();
  const { data: activities } = useCrmActivities();
  const { data: deals } = useCrmDeals();
  const { data: contacts } = useCrmContacts();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAndGenerateSuggestions = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newSuggestions: AISuggestion[] = [];

      // Analyser les activités en retard
      const overdueActivities = activities?.filter(activity => 
        activity.due_date && new Date(activity.due_date) < new Date() && activity.status !== 'completed'
      ) || [];

      if (overdueActivities.length > 0) {
        newSuggestions.push({
          id: 'overdue-activities',
          type: 'follow_up',
          title: `${overdueActivities.length} activité(s) en retard`,
          description: 'Certaines activités ont dépassé leur échéance. Il serait bon de les prioriser.',
          priority: 'high',
          action: () => {
            createTodo({
              user_id: user?.id || '',
              title: 'Rattraper les activités en retard',
              description: `Examiner et traiter ${overdueActivities.length} activité(s) en retard`,
              priority: 'high',
              status: 'pending',
              category: 'follow_up'
            });
          }
        });
      }

      // Analyser les deals sans activité récente
      const dealsWithoutRecentActivity = deals?.filter(deal => {
        const recentActivities = activities?.filter(activity => 
          activity.related_entity_type === 'deal' && 
          activity.related_entity_id === deal.id &&
          new Date(activity.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 jours
        ) || [];
        return recentActivities.length === 0 && deal.status !== 'closed_won' && deal.status !== 'closed_lost';
      }) || [];

      if (dealsWithoutRecentActivity.length > 0) {
        newSuggestions.push({
          id: 'inactive-deals',
          type: 'follow_up',
          title: `${dealsWithoutRecentActivity.length} deal(s) inactif(s)`,
          description: 'Ces deals n\'ont pas eu d\'activité récente. Un suivi pourrait être nécessaire.',
          priority: 'medium',
          action: () => {
            createTodo({
              user_id: user?.id || '',
              title: 'Relancer les deals inactifs',
              description: `Contacter les prospects pour ${dealsWithoutRecentActivity.length} deal(s) sans activité récente`,
              priority: 'medium',
              status: 'pending',
              category: 'follow_up'
            });
          }
        });
      }

      // Analyser les contacts sans interaction récente
      const contactsWithoutRecentInteraction = contacts?.filter(contact => {
        const recentActivities = activities?.filter(activity => 
          activity.related_entity_type === 'contact' && 
          activity.related_entity_id === contact.id &&
          new Date(activity.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
        ) || [];
        return recentActivities.length === 0;
      }) || [];

      if (contactsWithoutRecentInteraction.length > 5) {
        newSuggestions.push({
          id: 'inactive-contacts',
          type: 'todo',
          title: 'Réactiver les contacts dormants',
          description: `${contactsWithoutRecentInteraction.length} contacts n'ont pas eu d'interaction depuis 30 jours`,
          priority: 'low',
          action: () => {
            createTodo({
              user_id: user?.id || '',
              title: 'Campagne de réactivation',
              description: 'Organiser une campagne pour réactiver les contacts dormants',
              priority: 'low',
              status: 'pending',
              category: 'marketing'
            });
          }
        });
      }

      // Suggestions basées sur les priorités
      const highPriorityTodos = todos.filter(todo => todo.priority === 'high' && todo.status === 'pending');
      if (highPriorityTodos.length > 3) {
        newSuggestions.push({
          id: 'high-priority-overload',
          type: 'priority',
          title: 'Surcharge de tâches prioritaires',
          description: 'Vous avez beaucoup de tâches haute priorité. Considérez déléguer ou reporter certaines.',
          priority: 'medium'
        });
      }

      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 2000); // Simulation du temps d'analyse
  };

  useEffect(() => {
    if (todos.length > 0 || activities?.length || deals?.length || contacts?.length) {
      analyzeAndGenerateSuggestions();
    }
  }, [todos.length, activities?.length, deals?.length, contacts?.length]);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'follow_up':
        return <Clock size={16} className="text-orange-600" />;
      case 'priority':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'todo':
        return <CheckCircle2 size={16} className="text-green-600" />;
      default:
        return <Lightbulb size={16} className="text-blue-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Moyen</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Faible</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Info</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} className="text-blue-600" />
          Agent IA Proactif
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Analyse de vos données CRM pour des suggestions intelligentes
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeAndGenerateSuggestions}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyse...' : 'Actualiser'}
            </Button>
          </div>

          {isAnalyzing ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id} 
                  className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">{suggestion.title}</h4>
                          {getPriorityBadge(suggestion.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      </div>
                    </div>
                    {suggestion.action && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={suggestion.action}
                        className="ml-2"
                      >
                        Créer tâche
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Users size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune suggestion pour le moment. L'IA analyse vos données...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProactiveAIAgent;
