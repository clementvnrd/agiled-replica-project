import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, X, Clock, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCrmTodos, type CrmTodo } from '@/hooks/crm/useCrmTodos';
import { useCrmActivities } from '@/hooks/crm/useCrmActivities';
import { useCrmDeals } from '@/hooks/crm/useCrmDeals';
import { useCrmContacts } from '@/hooks/crm/useCrmContacts';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

interface AISuggestion {
  id: string;
  type: 'crm' | 'project' | 'task' | 'productivity';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionData: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  };
}

const AISuggestionCards: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { createTodo } = useCrmTodos();
  const { data: activities } = useCrmActivities();
  const { data: deals } = useCrmDeals();
  const { data: contacts } = useCrmContacts();
  const { projects } = useProjects();
  const { tasks } = useTasks();
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const generateAISuggestions = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newSuggestions: AISuggestion[] = [];

      // Analyse CRM - Activités en retard
      const overdueActivities = activities?.filter(activity => 
        activity.due_date && new Date(activity.due_date) < new Date() && activity.status !== 'completed'
      ) || [];

      if (overdueActivities.length > 0) {
        newSuggestions.push({
          id: 'overdue-activities',
          type: 'crm',
          title: `${overdueActivities.length} activité(s) CRM en retard`,
          description: 'Il y a des activités CRM qui ont dépassé leur échéance. Rattraper ces activités pourrait améliorer vos relations clients.',
          priority: 'high',
          category: 'crm_follow_up',
          actionData: {
            title: 'Rattraper les activités CRM en retard',
            description: `Examiner et traiter ${overdueActivities.length} activité(s) en retard`,
            priority: 'high',
            category: 'crm_follow_up'
          }
        });
      }

      // Analyse Projets - Projets sans progression récente
      const stagnantProjects = projects?.filter(project => {
        const recentTasks = tasks?.filter(task => 
          task.project_id === project.id &&
          new Date(task.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ) || [];
        return recentTasks.length === 0 && project.status === 'active';
      }) || [];

      if (stagnantProjects.length > 0) {
        newSuggestions.push({
          id: 'stagnant-projects',
          type: 'project',
          title: `${stagnantProjects.length} projet(s) sans activité récente`,
          description: 'Ces projets n\'ont pas eu de mise à jour récente. Il serait bon de faire le point sur leur avancement.',
          priority: 'medium',
          category: 'project_review',
          actionData: {
            title: 'Révision des projets stagnants',
            description: `Faire le point sur ${stagnantProjects.length} projet(s) sans activité récente`,
            priority: 'medium',
            category: 'project_review'
          }
        });
      }

      // Analyse Tâches - Tâches en retard sur les projets
      const overdueTasks = tasks?.filter(task => 
        task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
      ) || [];

      if (overdueTasks.length > 2) {
        newSuggestions.push({
          id: 'overdue-tasks',
          type: 'task',
          title: `${overdueTasks.length} tâches en retard`,
          description: 'Plusieurs tâches de projets ont dépassé leur échéance. Prioriser ces tâches pourrait améliorer la productivité.',
          priority: 'high',
          category: 'task_management',
          actionData: {
            title: 'Planifier le rattrapage des tâches',
            description: `Organiser le rattrapage de ${overdueTasks.length} tâches en retard`,
            priority: 'high',
            category: 'task_management'
          }
        });
      }

      // Analyse Deals - Deals sans suivi récent
      const inactiveDeals = deals?.filter(deal => {
        const recentActivities = activities?.filter(activity => 
          activity.related_to_deal_id === deal.id &&
          new Date(activity.created_at) > new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        ) || [];
        return recentActivities.length === 0 && deal.stage !== 'closed_won' && deal.stage !== 'closed_lost';
      }) || [];

      if (inactiveDeals.length > 0) {
        newSuggestions.push({
          id: 'inactive-deals',
          type: 'crm',
          title: `${inactiveDeals.length} deal(s) sans suivi récent`,
          description: 'Ces deals n\'ont pas eu de suivi récent. Un contact pourrait relancer les négociations.',
          priority: 'medium',
          category: 'sales_follow_up',
          actionData: {
            title: 'Relancer les deals inactifs',
            description: `Contacter les prospects pour ${inactiveDeals.length} deal(s) sans activité récente`,
            priority: 'medium',
            category: 'sales_follow_up'
          }
        });
      }

      // Analyse Productivité - Optimisation basée sur les données
      const totalActiveProjects = projects?.filter(p => p.status === 'active').length || 0;
      const averageTasksPerProject = totalActiveProjects > 0 ? (tasks?.length || 0) / totalActiveProjects : 0;

      if (totalActiveProjects > 3 && averageTasksPerProject > 10) {
        newSuggestions.push({
          id: 'workload-optimization',
          type: 'productivity',
          title: 'Charge de travail élevée détectée',
          description: `Vous avez ${totalActiveProjects} projets actifs avec une moyenne de ${Math.round(averageTasksPerProject)} tâches chacun. Considérer une priorisation.`,
          priority: 'medium',
          category: 'productivity',
          actionData: {
            title: 'Révision de la charge de travail',
            description: 'Analyser et prioriser les projets pour optimiser la productivité',
            priority: 'medium',
            category: 'productivity'
          }
        });
      }

      // Filtrer les suggestions déjà rejetées
      const filteredSuggestions = newSuggestions.filter(
        suggestion => !dismissedSuggestions.includes(suggestion.id)
      );

      setSuggestions(filteredSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    if (activities?.length || deals?.length || contacts?.length || projects?.length || tasks?.length) {
      generateAISuggestions();
    }
  }, [activities?.length, deals?.length, contacts?.length, projects?.length, tasks?.length]);

  const handleAcceptSuggestion = async (suggestion: AISuggestion) => {
    try {
      await createTodo({
        user_id: user?.id || '',
        title: suggestion.actionData.title,
        description: suggestion.actionData.description,
        priority: suggestion.actionData.priority,
        status: 'pending',
        category: suggestion.actionData.category,
        due_date: null
      });

      // Retirer la suggestion acceptée
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      toast.success('Suggestion acceptée et tâche créée !');
    } catch (error) {
      toast.error('Erreur lors de la création de la tâche');
      console.error('Error accepting suggestion:', error);
    }
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    setDismissedSuggestions(prev => [...prev, suggestionId]);
    toast.info('Suggestion rejetée');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'crm':
        return <Users size={20} className="text-blue-600" />;
      case 'project':
        return <TrendingUp size={20} className="text-green-600" />;
      case 'task':
        return <Clock size={20} className="text-orange-600" />;
      case 'productivity':
        return <AlertTriangle size={20} className="text-purple-600" />;
      default:
        return <Bot size={20} className="text-gray-600" />;
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

  if (isAnalyzing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bot size={24} className="text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold">Assistant IA analyse vos données...</h3>
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <Bot size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune suggestion pour le moment</h3>
        <p className="text-muted-foreground mb-4">
          L'IA analyse vos données et reviendra avec des suggestions d'amélioration.
        </p>
        <Button variant="outline" onClick={generateAISuggestions}>
          Générer des suggestions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-blue-600" />
          <h3 className="text-lg font-semibold">Suggestions IA</h3>
        </div>
        <Button variant="outline" size="sm" onClick={generateAISuggestions}>
          Actualiser
        </Button>
      </div>

      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    {getPriorityBadge(suggestion.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptSuggestion(suggestion)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 size={16} className="mr-1" />
                      Accepter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRejectSuggestion(suggestion.id)}
                    >
                      <X size={16} className="mr-1" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AISuggestionCards;
