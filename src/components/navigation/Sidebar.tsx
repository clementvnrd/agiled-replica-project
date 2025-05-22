import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Calendar, Settings, Users, FileText, Database } from 'lucide-react';
import { SidebarNavItem, SidebarNavGroup, ragNavGroup } from './SidebarNavGroup';
import { cn } from '@/lib/utils';

const navItems = [
  {
    icon: <Home size={16} />,
    label: "Tableau de bord",
    to: "/dashboard",
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
  },
  {
    icon: <FileText size={16} />,
    label: "Productivité",
    to: "/productivity",
  },
  {
    icon: <Book size={16} />,
    label: "Finance",
    to: "/finance",
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
  },
  {
    icon: <Book size={16} />,
    label: "Fitness",
    to: "/fitness",
  },
];

const aiNavItems = [
  {
    icon: <Users size={16} />,
    label: "Agent Manager",
    to: "/agent",
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
    icon: <Settings size={16} />,
    label: "MCP Manager",
    to: "/mcp",
  },
];

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
          <SidebarNavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={location.pathname === item.to}
          />
        ))}
        <SidebarNavGroup
          title="Business"
          icon={<Book size={16} />}
          items={businessNavItems}
        />
        <SidebarNavGroup
          title="Personnel"
          icon={<Calendar size={16} />}
          items={personalNavItems}
        />
        <SidebarNavGroup
          title="IA & Agents"
          icon={<Users size={16} />}
          items={aiNavItems}
        />
        <SidebarNavGroup {...ragNavGroup} />
        <SidebarNavGroup
          title="Paramètres"
          icon={<Settings size={16} />}
          items={settingsNavItems}
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
            <SidebarNavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={location.pathname === item.to}
            />
          ))}
          <SidebarNavGroup
            title="Business"
            icon={<Book size={16} />}
            items={businessNavItems}
          />
          <SidebarNavGroup
            title="Personnel"
            icon={<Calendar size={16} />}
            items={personalNavItems}
          />
          <SidebarNavGroup
            title="IA & Agents"
            icon={<Users size={16} />}
            items={aiNavItems}
          />
          <SidebarNavGroup {...ragNavGroup} />
          <SidebarNavGroup
            title="Paramètres"
            icon={<Settings size={16} />}
            items={settingsNavItems}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
