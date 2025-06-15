
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Book, Calendar, Bot, Settings, Sparkles } from 'lucide-react';
import { SidebarNavGroup, ragNavGroup } from './SidebarNavGroup';
import { EnhancedSidebarNavItem } from './EnhancedSidebarNavItem';
import { navItems, crmNavItems, productivityNavItems, financeNavItems, personalNavItems, aiNavItems, settingsNavItems } from './navItems';

const DesktopSidebar: React.FC = () => {
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
      <nav className="p-6 space-y-1 flex-1 overflow-y-auto">
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

export default DesktopSidebar;
