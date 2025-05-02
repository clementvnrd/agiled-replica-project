
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { 
  Home,
  Users, 
  Calendar, 
  DollarSign,
  FileText,
  Clock,
  Settings,
  UserCog,
  Box,
  FileBox,
  Rocket,
  BookOpen,
  Activity,
  User,
  Bot,
  Plug
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expandable?: boolean;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, expandable = false, active = false }) => {
  return (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
      {icon}
      <span>{label}</span>
      {expandable && (
        <span className="ml-auto">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [categoryOpen, setCategoryOpen] = useState({
    business: true,
    personal: true,
    ai: true
  });

  const toggleCategory = (category: keyof typeof categoryOpen) => {
    setCategoryOpen(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <aside className="w-64 h-screen bg-agiled-sidebar border-r border-agiled-lightBorder flex flex-col">
      <div className="p-4 border-b border-agiled-lightBorder">
        <Logo />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/" 
            icon={<Home size={20} />} 
            label="Tableau de bord"
            active={path === '/'} 
          />
        </div>
        
        <div className="py-2">
          <div 
            className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer"
            onClick={() => toggleCategory('business')}
          >
            <span className="mr-2">{categoryOpen.business ? '▼' : '►'}</span>
            <span>Business</span>
          </div>
          
          {categoryOpen.business && (
            <div className="pl-3">
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/crm" 
                  icon={<Users size={20} />} 
                  label="CRM" 
                  expandable
                  active={path.startsWith('/crm')}
                />
              </div>
              
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/productivity" 
                  icon={<Calendar size={20} />} 
                  label="Productivity" 
                  expandable
                  active={path.startsWith('/productivity')}
                />
              </div>
              
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/finance" 
                  icon={<DollarSign size={20} />} 
                  label="Finance" 
                  expandable
                  active={path.startsWith('/finance')}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="py-2">
          <div 
            className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer"
            onClick={() => toggleCategory('personal')}
          >
            <span className="mr-2">{categoryOpen.personal ? '▼' : '►'}</span>
            <span>Personnel</span>
          </div>
          
          {categoryOpen.personal && (
            <div className="pl-3">
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/personal" 
                  icon={<User size={20} />} 
                  label="Vue générale" 
                  active={path === '/personal'}
                />
              </div>
              
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/studies" 
                  icon={<BookOpen size={20} />} 
                  label="Études" 
                  expandable
                  active={path.startsWith('/studies')}
                />
              </div>
              
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/fitness" 
                  icon={<Activity size={20} />} 
                  label="Fitness" 
                  expandable
                  active={path.startsWith('/fitness')}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="py-2">
          <div 
            className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer"
            onClick={() => toggleCategory('ai')}
          >
            <span className="mr-2">{categoryOpen.ai ? '▼' : '►'}</span>
            <span>Intelligence Artificielle</span>
          </div>
          
          {categoryOpen.ai && (
            <div className="pl-3">
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/agent" 
                  icon={<Bot size={20} />} 
                  label="Agent Manager" 
                  active={path.startsWith('/agent')}
                />
              </div>
              
              <div className="px-3 sidebar-nav-group">
                <NavItem 
                  to="/mcp" 
                  icon={<Plug size={20} />} 
                  label="Connecteurs MCP" 
                  active={path.startsWith('/mcp')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="px-4 py-3 bg-blue-50 border-t border-agiled-lightBorder">
          <div className="text-sm">
            <p className="text-center mb-1">Intégrations: Strava, OpenRouter</p>
            <button className="btn-primary w-full">Connecter + d'outils</button>
          </div>
        </div>
        <div className="p-3 border-t border-agiled-lightBorder">
          <NavItem 
            to="/settings" 
            icon={<Settings size={20} />} 
            label="Paramètres"
            active={path.startsWith('/settings')}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
