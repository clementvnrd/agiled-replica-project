
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimisticActionProps {
  children: React.ReactNode;
  onAction: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
}

type ActionState = 'idle' | 'loading' | 'success' | 'error';

const OptimisticAction: React.FC<OptimisticActionProps> = ({
  children,
  onAction,
  successMessage = "Action réussie",
  errorMessage = "Erreur lors de l'action",
  className,
  disabled = false
}) => {
  const [state, setState] = useState<ActionState>('idle');

  const handleAction = async () => {
    if (disabled || state === 'loading') return;

    setState('loading');
    
    try {
      await onAction();
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Traitement...
          </>
        );
      case 'success':
        return (
          <>
            <Check className="h-4 w-4 mr-2" />
            {successMessage}
          </>
        );
      case 'error':
        return (
          <>
            <X className="h-4 w-4 mr-2" />
            {errorMessage}
          </>
        );
      default:
        return children;
    }
  };

  const getButtonVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Button
      onClick={handleAction}
      disabled={disabled || state === 'loading'}
      variant={getButtonVariant()}
      className={cn(
        "transition-all duration-200",
        state === 'success' && "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      {getButtonContent()}
    </Button>
  );
};

export { OptimisticAction };
