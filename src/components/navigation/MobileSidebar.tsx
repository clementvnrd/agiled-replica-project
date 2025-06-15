
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Users, FileText, Book, Calendar, Bot, Settings, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from 'react-router-dom';
import { SidebarNavGroup, ragNavGroup } from './SidebarNavGroup';
import { EnhancedSidebarNavItem } from './EnhancedSidebarNavItem';
import { navItems, crmNavItems, productivityNavItems, financeNavItems, personalNavItems, aiNavItems, settingsNavItems } from './navItems';

export const MobileSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 overflow-y-auto">
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
