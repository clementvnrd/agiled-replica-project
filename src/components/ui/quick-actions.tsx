
import * as React from "react";
import { Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  category?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, className }) => {
  const groupedActions = actions.reduce((acc, action) => {
    const category = action.category || "Général";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56">
          {Object.entries(groupedActions).map(([category, categoryActions], index) => (
            <div key={category}>
              {index > 0 && <DropdownMenuSeparator />}
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                {category}
              </div>
              {categoryActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={action.onClick}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { QuickActions, type QuickAction };
