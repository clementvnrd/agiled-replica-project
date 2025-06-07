
import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  label: string;
  value: number;
  max: number;
  description?: string;
  color?: "default" | "success" | "warning" | "error";
  showPercentage?: boolean;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  label,
  value,
  max,
  description,
  color = "default",
  showPercentage = true,
  className,
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const colorClasses = {
    default: "text-primary",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {showPercentage && (
          <span className={cn("text-sm font-medium", colorClasses[color])}>
            {percentage}%
          </span>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {description && <span>{description}</span>}
        <span>
          {value} / {max}
        </span>
      </div>
    </div>
  );
};

export { ProgressIndicator };
