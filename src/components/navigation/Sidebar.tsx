import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Calendar, Settings, Users, FileText, Database, Bot, Plug } from 'lucide-react';
import { SidebarNavItem, SidebarNavGroup, ragNavGroup } from './SidebarNavGroup';
import { StatusIndicator } from '@/components/ui/status-indicator';
import SidebarMenuBadge from '@/components/ui/sidebar/SidebarMenuBadge';
import { cn } from '@/lib/utils';

const navItems = [
  {
    icon: <Home size={16} />,
    label: "Tableau de bord",
    to: "/dashboard",
    status: "connected" as const,
  },
  {
    icon: <Book size={16} />,
    label: "Projets",
    to: "/projects",
  },
  {
    icon: <Calendar size={16} />,
    label: "Calendrier",
    to: "/calendar",
  },
];

const businessNavItems = [
  {
    icon: <Users size={16} />,
    label: "CRM",
    to: "/crm",
    badge: { count: 3, variant: "info" as const },
  },
  {
    icon: <FileText size={16} />,
    label: "Productivité",
    to: "/productivity",
    badge: { count: 5, variant: "warning" as const },
  },
  {
    icon: <Book size={16} />,
    label: "Finance",
    to: "/finance",
    status: "disconnected" as const,
  },
];

const personalNavItems = [
  {
    icon: <Users size={16} />,
    label: "Personnel",
    to: "/personal",
  },
  {
    icon: <FileText size={16} />,
    label: "Études",
    to: "/studies",
    badge: { count: 2, variant: "success" as const },
  },
  {
    icon: <Book size={16} />,
    label: "Fitness",
    to: "/fitness",
    status: "connected" as const,
  },
];

const aiNavItems = [
  {
    icon: <Bot size={16} />,
    label: "Agent Manager",
    to: "/agent",
    status: "connected" as const,
    badge: { showDot: true, variant: "success" as const },
  },
];

const settingsNavItems = [
  {
    icon: <Settings size={16} />,
    label: "Paramètres",
    to: "/settings",
  },
  {
    icon: <Users size={16} />,
    label: "Profil",
    to: "/profil",
  },
  {
    icon: <Plug size={16} />,
    label: "MCP Manager",
    to: "/mcp",
    status: "loading" as const,
  },
];

const EnhancedSidebarNavItem: React.FC<{
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

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="border-r flex-shrink-0 w-64 hidden md:block">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <img src="/logo.png" alt="Agiled Logo" className="w-8 h-8" />
          <span>Agiled</span>
        </Link>
      </div>
      <Separator />
      <nav className="p-6 space-y-4">
        {navItems.map((item) => (
          <EnhancedSidebarNavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={location.pathname === item.to}
            status={item.status}
          />
        ))}
        <SidebarNavGroup
          title="Business"
          icon={<Book size={16} />}
          items={businessNavItems.map(item => ({
            ...item,
            enhanced: true,
            status: item.status,
            badge: item.badge
          }))}
        />
        <SidebarNavGroup
          title="Personnel"
          icon={<Calendar size={16} />}
          items={personalNavItems.map(item => ({
            ...item,
            enhanced: true,
            status: item.status,
            badge: item.badge
          }))}
        />
        <SidebarNavGroup
          title="IA & Agents"
          icon={<Bot size={16} />}
          items={aiNavItems.map(item => ({
            ...item,
            enhanced: true,
            status: item.status,
            badge: item.badge
          }))}
        />
        <SidebarNavGroup {...ragNavGroup} />
        <SidebarNavGroup
          title="Paramètres"
          icon={<Settings size={16} />}
          items={settingsNavItems.map(item => ({
            ...item,
            enhanced: true,
            status: item.status
          }))}
        />
      </nav>
    </div>
  );
};

export const MobileSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold">
            <img src="/logo.png" alt="Agiled Logo" className="w-8 h-8" />
            <span>Agiled</span>
          </Link>
        </div>
        <Separator />
        <nav className="p-6 space-y-4">
          {navItems.map((item) => (
            <EnhancedSidebarNavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={location.pathname === item.to}
              status={item.status}
            />
          ))}
          <SidebarNavGroup
            title="Business"
            icon={<Book size={16} />}
            items={businessNavItems.map(item => ({
              ...item,
              enhanced: true,
              status: item.status,
              badge: item.badge
            }))}
          />
          <SidebarNavGroup
            title="Personnel"
            icon={<Calendar size={16} />}
            items={personalNavItems.map(item => ({
              ...item,
              enhanced: true,
              status: item.status,
              badge: item.badge
            }))}
          />
          <SidebarNavGroup
            title="IA & Agents"
            icon={<Bot size={16} />}
            items={aiNavItems.map(item => ({
              ...item,
              enhanced: true,
              status: item.status,
              badge: item.badge
            }))}
          />
          <SidebarNavGroup {...ragNavGroup} />
          <SidebarNavGroup
            title="Paramètres"
            icon={<Settings size={16} />}
            items={settingsNavItems.map(item => ({
              ...item,
              enhanced: true,
              status: item.status
            }))}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
