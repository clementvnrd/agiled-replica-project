
import * as React from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: Date;
  user?: string;
  icon?: React.ReactNode;
  category: "success" | "info" | "warning" | "error" | "default";
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  className,
  maxItems = 10,
}) => {
  const categoryColors = {
    success: "border-green-500 bg-green-50",
    info: "border-blue-500 bg-blue-50",
    warning: "border-yellow-500 bg-yellow-50",
    error: "border-red-500 bg-red-50",
    default: "border-gray-300 bg-gray-50",
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={cn("space-y-4", className)}>
      {displayedActivities.map((activity, index) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center",
              categoryColors[activity.category]
            )}
          >
            {activity.icon || (
              <div className="w-2 h-2 rounded-full bg-current opacity-60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <time className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.timestamp, {
                  addSuffix: true,
                  locale: fr,
                })}
              </time>
            </div>
            {activity.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </p>
            )}
            {activity.user && (
              <p className="text-xs text-muted-foreground mt-1">
                Par {activity.user}
              </p>
            )}
          </div>
          {index < displayedActivities.length - 1 && (
            <div className="absolute left-4 top-8 w-px h-8 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
};

export { ActivityFeed, type ActivityItem };
