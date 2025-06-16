
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Target, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCrmDeals } from '@/hooks/crm/useCrmDeals';
import { useCrmTodos, type CrmTodo } from '@/hooks/crm/useCrmTodos';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

interface FinancialInsight {
  id: string;
  type: 'revenue_projection' | 'deal_risk' | 'cash_flow' | 'target_analysis';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  value?: number;
  actionData: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  };
}

const CrmFinanceIntegration: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { data: deals } = useCrmDeals();
  const { createTodo } = useCrmTodos();
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateFinancialInsights = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newInsights: FinancialInsight[] = [];

      if (!deals?.length) {
        setInsights([]);
        setIsAnalyzing(false);
        return;
      }

      // Analyse des projections de revenus
      const totalPipelineValue = deals
        .filter(deal => deal.stage !== 'closed_lost')
        .reduce((sum, deal) => sum + (deal.value || 0), 0);

      const closedWonValue = deals
        .filter(deal => deal.stage === 'closed_won')
        .reduce((sum, deal) => sum + (deal.value || 0), 0);

      if (totalPipelineValue > 0) {
        newInsights.push({
          id: 'revenue-projection',
          type: 'revenue_projection',
          title: `Pipeline de ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPipelineValue)}`,
          description: `Votre pipeline actuel représente un potentiel de revenus significatif. Prioriser la conversion pourrait améliorer vos résultats financiers.`,
          impact: 'high',
          value: totalPipelineValue,
          actionData: {
            title: 'Optimiser la conversion du pipeline',
            description: `Développer une stratégie pour convertir ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPipelineValue)} de pipeline`,
            priority: 'high',
            category: 'finance_optimization'
          }
        });
      }

      // Analyse des deals à risque (proches de l'échéance)
      const riskDeals = deals.filter(deal => {
        if (!deal.expected_close_date || deal.stage === 'closed_won' || deal.stage === 'closed_lost') {
          return false;
        }
        const closeDate = new Date(deal.expected_close_date);
        const now = new Date();
        const daysUntilClose = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilClose <= 7 && daysUntilClose >= 0;
      });

      if (riskDeals.length > 0) {
        const riskValue = riskDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
        newInsights.push({
          id: 'deal-risk',
          type: 'deal_risk',
          title: `${riskDeals.length} deal(s) à risque cette semaine`,
          description: `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(riskValue)} de revenus potentiels nécessitent une attention urgente.`,
          impact: 'high',
          value: riskValue,
          actionData: {
            title: 'Sécuriser les deals à risque',
            description: `Action urgente requise sur ${riskDeals.length} deal(s) représentant ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(riskValue)}`,
            priority: 'high',
            category: 'sales_urgency'
          }
        });
      }

      // Analyse de performance (taux de conversion)
      const totalDeals = deals.length;
      const wonDeals = deals.filter(deal => deal.stage === 'closed_won').length;
      const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;

      if (totalDeals >= 5 && conversionRate < 30) {
        newInsights.push({
          id: 'conversion-analysis',
          type: 'target_analysis',
          title: `Taux de conversion: ${conversionRate.toFixed(1)}%`,
          description: `Votre taux de conversion est inférieur à la moyenne. Une amélioration pourrait significativement impacter vos revenus.`,
          impact: 'medium',
          actionData: {
            title: 'Améliorer le taux de conversion',
            description: `Analyser et optimiser le processus de vente pour améliorer le taux de conversion de ${conversionRate.toFixed(1)}%`,
            priority: 'medium',
            category: 'sales_process'
          }
        });
      }

      // Analyse du cash flow prévisionnel
      const nextQuarterDeals = deals.filter(deal => {
        if (!deal.expected_close_date || deal.stage === 'closed_won' || deal.stage === 'closed_lost') {
          return false;
        }
        const closeDate = new Date(deal.expected_close_date);
        const now = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return closeDate >= now && closeDate <= threeMonthsFromNow;
      });

      if (nextQuarterDeals.length > 0) {
        const quarterValue = nextQuarterDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
        newInsights.push({
          id: 'cash-flow',
          type: 'cash_flow',
          title: `Prévision Q+1: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quarterValue)}`,
          description: `${nextQuarterDeals.length} deal(s) prévus pour les 3 prochains mois. Planifier la gestion de trésorerie.`,
          impact: 'medium',
          value: quarterValue,
          actionData: {
            title: 'Planifier la gestion de trésorerie',
            description: `Préparer la gestion financière pour ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quarterValue)} de revenus attendus`,
            priority: 'medium',
            category: 'cash_flow_planning'
          }
        });
      }

      setInsights(newInsights);
      setIsAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    if (deals?.length) {
      generateFinancialInsights();
    }
  }, [deals?.length]);

  const handleAcceptInsight = async (insight: FinancialInsight) => {
    try {
      await createTodo({
        user_id: user?.id || '',
        title: insight.actionData.title,
        description: insight.actionData.description,
        priority: insight.actionData.priority,
        status: 'pending',
        category: insight.actionData.category,
        due_date: null
      });

      setInsights(prev => prev.filter(i => i.id !== insight.id));
      toast.success('Tâche financière créée avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la création de la tâche');
      console.error('Error accepting financial insight:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'revenue_projection':
        return <TrendingUp size={20} className="text-green-600" />;
      case 'deal_risk':
        return <AlertTriangle size={20} className="text-red-600" />;
      case 'cash_flow':
        return <DollarSign size={20} className="text-blue-600" />;
      case 'target_analysis':
        return <Target size={20} className="text-purple-600" />;
      default:
        return <PieChart size={20} className="text-gray-600" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Impact élevé</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Impact moyen</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Impact faible</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Info</Badge>;
    }
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} className="text-green-600 animate-pulse" />
            Analyse CRM-Finance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Analyse CRM-Finance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <PieChart size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune analyse disponible</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des deals CRM pour obtenir des insights financiers.
            </p>
            <Button variant="outline" onClick={generateFinancialInsights}>
              Actualiser l'analyse
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Insights CRM-Finance
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateFinancialInsights}>
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      {getImpactBadge(insight.impact)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    {insight.value && (
                      <p className="text-xs font-medium text-green-700 mb-3">
                        Valeur: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(insight.value)}
                      </p>
                    )}
                    <Button 
                      size="sm" 
                      onClick={() => handleAcceptInsight(insight)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Créer une tâche
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrmFinanceIntegration;
