
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { StatusIndicator } from '@/components/ui/status-indicator';
import SidebarMenuBadge from '@/components/ui/sidebar/SidebarMenuBadge';

export const EnhancedSidebarNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  status?: "connected" | "disconnected" | "loading" | "error";
  badge?: { count?: number; variant?: "default" | "success" | "warning" | "error" | "info"; showDot?: boolean };
}> = ({ icon, label, to, isActive, status, badge }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      <div className="flex items-center gap-2">
        {status && <StatusIndicator status={status} size="sm" />}
        {badge && (
          <SidebarMenuBadge
            count={badge.count}
            variant={badge.variant}
            showDot={badge.showDot}
          />
        )}
      </div>
    </Link>
  );
};
