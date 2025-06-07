
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarMenuBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  count?: number;
  showDot?: boolean;
}

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, SidebarMenuBadgeProps>(
  ({ className, variant = "default", count, showDot = false, children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-500 text-white",
      success: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
    };

    if (showDot && !count) {
      return (
        <div
          ref={ref}
          className={cn(
            "w-2 h-2 rounded-full",
            variantClasses[variant],
            className
          )}
          {...props}
        />
      );
    }

    if (count && count > 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "px-1.5 py-0.5 text-xs rounded-full font-medium min-w-[18px] h-[18px] flex items-center justify-center",
            variantClasses[variant],
            className
          )}
          {...props}
        >
          {count > 99 ? "99+" : count}
        </div>
      );
    }

    return children ? (
      <div ref={ref} className={cn("text-xs", className)} {...props}>
        {children}
      </div>
    ) : null;
  }
);

SidebarMenuBadge.displayName = "SidebarMenuBadge";

export default SidebarMenuBadge;
