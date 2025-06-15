import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Database, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}
interface SidebarNavGroupProps {
  title: string;
  icon?: React.ReactNode;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    to: string;
  }>;
}
export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon,
  label,
  to,
  isActive
}) => {
  return;
};
export const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({
  title,
  icon,
  items
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(items.some(item => location.pathname.startsWith(item.to)));
  return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-agiled-text hover:bg-gray-100 transition-all">
        <span className="flex items-center gap-2">
          {icon || <Home size={16} />}
          {title}
        </span>
        <ChevronRight size={16} className={cn("text-gray-400 transition-transform duration-200", isOpen && "transform rotate-90")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-1 pl-2">
          {items.map((item, index) => <SidebarNavItem key={index} icon={item.icon} label={item.label} to={item.to} isActive={location.pathname === item.to} />)}
        </div>
      </CollapsibleContent>
    </Collapsible>;
};

// Ajouter un groupe RAG pour la navigation
export const ragNavGroup = {
  title: "Système RAG",
  icon: <Database size={16} />,
  items: [{
    icon: <FileText size={16} />,
    label: "Documents RAG",
    to: "/rag"
  }]
};
export default SidebarNavGroup;