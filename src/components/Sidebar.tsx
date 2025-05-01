
import React from 'react';
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
  Rocket
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

  return (
    <aside className="w-64 h-screen bg-agiled-sidebar border-r border-agiled-lightBorder flex flex-col">
      <div className="p-4 border-b border-agiled-lightBorder">
        <Logo />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/launchpad" 
            icon={<Home size={20} />} 
            label="Launchpad"
            active={path === '/launchpad'} 
          />
        </div>
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/" 
            icon={<Home size={20} />} 
            label="Tableau de bord"
            active={path === '/'} 
          />
        </div>
        
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
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/docs" 
            icon={<FileText size={20} />} 
            label="Docs"
            active={path.startsWith('/docs')}
          />
        </div>
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/scheduling" 
            icon={<Clock size={20} />} 
            label="Scheduling" 
            expandable
            active={path.startsWith('/scheduling')}
          />
        </div>
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/hrm" 
            icon={<UserCog size={20} />} 
            label="HRM" 
            expandable
            active={path.startsWith('/hrm')}
          />
        </div>
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/essentials" 
            icon={<Box size={20} />} 
            label="Essentials" 
            expandable
            active={path.startsWith('/essentials')}
          />
        </div>
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/templates" 
            icon={<FileBox size={20} />} 
            label="Templates"
            active={path.startsWith('/templates')}
          />
        </div>
        
        <div className="px-3 sidebar-nav-group">
          <NavItem 
            to="/agiled-ai" 
            icon={<Rocket size={20} />} 
            label="Agiled AI 🚀"
            active={path.startsWith('/agiled-ai')}
          />
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="px-4 py-3 bg-blue-50 border-t border-agiled-lightBorder">
          <div className="text-sm">
            <p className="text-center mb-1">Your free trial expires in 12 day(s).</p>
            <button className="btn-primary w-full">Upgrade Now</button>
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
