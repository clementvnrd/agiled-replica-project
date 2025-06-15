
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrmActivities, type CrmActivity } from '@/hooks/crm/useCrmActivities';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CrmActivitiesPage: React.FC = () => {
  const { data: activities, isLoading } = useCrmActivities();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <User size={16} className="text-blue-600" />;
      case 'email':
        return <Calendar size={16} className="text-green-600" />;
      case 'meeting':
        return <Calendar size={16} className="text-purple-600" />;
      case 'todo':
        return <CheckCircle size={16} className="text-orange-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const;
      case 'pending':
        return 'secondary' as const;
      case 'overdue':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'call':
        return 'default' as const;
      case 'email':
        return 'secondary' as const;
      case 'meeting':
        return 'outline' as const;
      case 'todo':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesType = typeFilter === 'all' || activity.activity_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Activités CRM</h1>
        <p className="text-agiled-lightText">Gérez vos tâches, appels, emails et réunions</p>
      </div>

      {/* Actions et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher des activités..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter size={16} className="mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="call">Appel</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Réunion</SelectItem>
            <SelectItem value="todo">Tâche</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          Nouvelle activité
        </Button>
      </div>

      {/* Liste des activités */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity: CrmActivity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{activity.title}</h3>
                        <Badge variant={getTypeBadgeVariant(activity.activity_type)} className="text-xs">
                          {activity.activity_type === 'call' && 'Appel'}
                          {activity.activity_type === 'email' && 'Email'}
                          {activity.activity_type === 'meeting' && 'Réunion'}
                          {activity.activity_type === 'todo' && 'Tâche'}
                        </Badge>
                      </div>
                      
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Créé le {format(new Date(activity.created_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                        {activity.due_date && (
                          <span>
                            Échéance: {format(new Date(activity.due_date), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(activity.status)}
                    <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                      {activity.status === 'completed' && 'Terminé'}
                      {activity.status === 'pending' && 'En attente'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune activité trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Aucune activité ne correspond à vos critères de recherche.'
                  : 'Commencez par créer votre première activité.'}
              </p>
              <Button>
                <Plus size={16} className="mr-2" />
                Créer une activité
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CrmActivitiesPage;
