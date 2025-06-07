
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  hover?: boolean;
  interactive?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    icon, 
    actions, 
    hover = false, 
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-200",
          hover && "hover:shadow-md hover:-translate-y-1",
          interactive && "cursor-pointer hover:border-primary/50",
          className
        )}
        {...props}
      >
        {(title || subtitle || icon || actions) && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {icon}
                  </div>
                )}
                <div>
                  {title && <CardTitle className="text-lg">{title}</CardTitle>}
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

export { EnhancedCard };
