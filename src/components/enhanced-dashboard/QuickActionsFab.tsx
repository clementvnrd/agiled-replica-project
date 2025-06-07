
import React from 'react';
import { QuickActions, QuickAction } from '@/components/ui/quick-actions';
import { Plus, FileText, Users, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionsFab: React.FC = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'new-project',
      label: 'Nouveau projet',
      icon: <FileText className="h-4 w-4" />,
      onClick: () => navigate('/productivity'),
      category: 'Business'
    },
    {
      id: 'new-contact',
      label: 'Nouveau contact',
      icon: <Users className="h-4 w-4" />,
      onClick: () => navigate('/crm'),
      category: 'Business'
    },
    {
      id: 'new-event',
      label: 'Nouvel événement',
      icon: <Calendar className="h-4 w-4" />,
      onClick: () => console.log('Créer événement'),
      category: 'Planning'
    },
    {
      id: 'new-invoice',
      label: 'Nouvelle facture',
      icon: <DollarSign className="h-4 w-4" />,
      onClick: () => navigate('/finance'),
      category: 'Finance'
    },
  ];

  return <QuickActions actions={actions} />;
};

export default QuickActionsFab;
