
import React from 'react';
import { Illustration } from '@/components/ui/illustrations';
import { CallToAction } from '@/components/ui/call-to-action';
import { LucideIcon } from 'lucide-react';

interface EnhancedEmptyCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  color?: string;
}

const EnhancedEmptyCard: React.FC<EnhancedEmptyCardProps> = ({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  color = "#3b82f6"
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col justify-center">
      <Illustration
        icon={icon}
        title={title}
        description={description}
        color={color}
        size="md"
        className="mb-6"
      />
      
      <CallToAction
        title="Prêt à commencer ?"
        description="Commencez dès maintenant en quelques clics"
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        variant="minimal"
      />
    </div>
  );
};

export default EnhancedEmptyCard;
