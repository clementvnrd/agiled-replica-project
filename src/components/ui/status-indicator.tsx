
import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "connected" | "disconnected" | "loading" | "error";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, showLabel = false, size = "sm", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    const statusConfig = {
      connected: { color: "bg-green-500", label: "Connecté", pulse: false },
      disconnected: { color: "bg-gray-400", label: "Déconnecté", pulse: false },
      loading: { color: "bg-yellow-500", label: "Connexion...", pulse: true },
      error: { color: "bg-red-500", label: "Erreur", pulse: false },
    };

    const config = statusConfig[status];

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full",
            sizeClasses[size],
            config.color,
            config.pulse && "animate-pulse"
          )}
        />
        {showLabel && (
          <span className="text-xs text-muted-foreground">{config.label}</span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };
