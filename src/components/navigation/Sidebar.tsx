import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, DollarSign, Building, LayoutDashboard, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Calendar, Settings, Users, FileText, Database, Bot, Plug, Sparkles } from 'lucide-react';
import { SidebarNavItem, SidebarNavGroup, ragNavGroup } from './SidebarNavGroup';
import { StatusIndicator } from '@/components/ui/status-indicator';
import SidebarMenuBadge from '@/components/ui/sidebar/SidebarMenuBadge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

const crmNavItems = [
  {
    icon: <LayoutDashboard size={16} />,
    label: "Dashboard",
    to: "/crm",
    badge: { count: 3, variant: "info" as const },
  },
  {
    icon: <Building size={16} />,
    label: "Comptes",
    to: "/crm/accounts",
  },
  {
    icon: <Users size={16} />,
    label: "Contacts",
    to: "/crm/contacts",
  },
  {
    icon: <DollarSign size={16} />,
    label: "Deals",
    to: "/crm/deals",
  },
  {
    icon: <Ticket size={16} />,
    label: "Tickets",
    to: "/crm/tickets",
  },
];

const productivityNavItems = [
  {
    icon: <FileText size={16} />,
    label: "Productivité",
    to: "/productivity",
    badge: { count: 5, variant: "warning" as const },
  },
];

const financeNavItems = [
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
    <div className="border-r flex-shrink-0 w-64 hidden md:block h-screen bg-white flex flex-col">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <img src="/logo.png" alt="Agiled Logo" className="w-8 h-8" />
          <span>Agiled</span>
        </Link>
      </div>
      <Separator />
      <nav className="p-6 space-y-1 flex-1">
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
        <EnhancedSidebarNavItem
          key="/llm"
          icon={<Sparkles size={16} />}
          label="LLM"
          to="/llm"
          isActive={location.pathname.startsWith('/llm')}
        />

        <div className="pt-4">
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business</p>
          <SidebarNavGroup
            title="CRM"
            icon={<Users size={16} />}
            items={crmNavItems.map(item => ({
              ...item,
              enhanced: true,
              badge: item.badge
            }))}
          />
          <SidebarNavGroup
            title="Productivité"
            icon={<FileText size={16} />}
            items={productivityNavItems.map(item => ({
              ...item,
              enhanced: true,
              badge: item.badge
            }))}
          />
          <SidebarNavGroup
            title="Finance"
            icon={<Book size={16} />}
            items={financeNavItems.map(item => ({
              ...item,
              enhanced: true,
              status: item.status
            }))}
          />
        </div>

        <div className="pt-4">
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personnel</p>
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
        </div>
        
        <div className="pt-4">
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">IA &amp; Paramètres</p>
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
        </div>
      </nav>
      {/* Footer custom (intégrations, bouton, paramètres) */}
      <div className="mt-auto">
        <div className="px-4 py-3 bg-blue-50 border-t border-agiled-lightBorder">
          <div className="text-sm">
            <p className="text-center mb-1">Intégrations: Strava, OpenRouter</p>
            <button className="btn-primary w-full">Connecter + d'outils</button>
          </div>
        </div>
      </div>
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
        <nav className="p-6 space-y-1">
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
          <EnhancedSidebarNavItem
            key="/llm"
            icon={<Sparkles size={16} />}
            label="LLM"
            to="/llm"
            isActive={location.pathname.startsWith('/llm')}
          />

          <div className="pt-4">
            <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business</p>
            <SidebarNavGroup
              title="CRM"
              icon={<Users size={16} />}
              items={crmNavItems.map(item => ({ ...item, enhanced: true, badge: item.badge }))}
            />
            <SidebarNavGroup
              title="Productivité"
              icon={<FileText size={16} />}
              items={productivityNavItems.map(item => ({ ...item, enhanced: true, badge: item.badge }))}
            />
            <SidebarNavGroup
              title="Finance"
              icon={<Book size={16} />}
              items={financeNavItems.map(item => ({ ...item, enhanced: true, status: item.status }))}
            />
          </div>
          
          <div className="pt-4">
            <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personnel</p>
            <SidebarNavGroup
              title="Personnel"
              icon={<Calendar size={16} />}
              items={personalNavItems.map(item => ({ ...item, enhanced: true, status: item.status, badge: item.badge }))}
            />
          </div>

          <div className="pt-4">
            <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">IA &amp; Paramètres</p>
            <SidebarNavGroup
              title="IA & Agents"
              icon={<Bot size={16} />}
              items={aiNavItems.map(item => ({ ...item, enhanced: true, status: item.status, badge: item.badge }))}
            />
            <SidebarNavGroup {...ragNavGroup} />
            <SidebarNavGroup
              title="Paramètres"
              icon={<Settings size={16} />}
              items={settingsNavItems.map(item => ({ ...item, enhanced: true, status: item.status }))}
            />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
