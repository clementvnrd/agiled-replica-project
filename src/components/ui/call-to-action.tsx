
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CallToActionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className
}) => {
  const variantClasses = {
    default: "bg-card border border-border",
    gradient: "bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20",
    minimal: "bg-transparent"
  };

  return (
    <div className={cn(
      "p-6 rounded-lg text-center space-y-4",
      variantClasses[variant],
      className
    )}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={primaryAction.onClick}
          variant={primaryAction.variant || "default"}
          className="group"
        >
          <Plus className="h-4 w-4 mr-2" />
          {primaryAction.label}
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {secondaryAction && (
          <Button
            onClick={secondaryAction.onClick}
            variant="outline"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export { CallToAction };
