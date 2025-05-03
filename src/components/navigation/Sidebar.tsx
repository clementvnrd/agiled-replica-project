
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';
import SidebarItem from './SidebarItem';
import SidebarCategory from './SidebarCategory';
import SidebarNavGroup from './SidebarNavGroup';
import SidebarFooter from './SidebarFooter';
import { 
  Home,
  Users, 
  Calendar, 
  DollarSign,
  User,
  BookOpen,
  Activity,
  Bot,
  Plug
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="w-64 h-screen bg-agiled-sidebar border-r border-agiled-lightBorder flex flex-col">
      <div className="p-4 border-b border-agiled-lightBorder">
        <Logo />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNavGroup>
          <SidebarItem 
            to="/" 
            icon={<Home size={20} />} 
            label="Tableau de bord"
            active={path === '/'} 
          />
        </SidebarNavGroup>
        
        <SidebarCategory title="Business">
          <SidebarNavGroup>
            <SidebarItem 
              to="/crm" 
              icon={<Users size={20} />} 
              label="CRM" 
              expandable
              active={path.startsWith('/crm')}
            />
          </SidebarNavGroup>
          
          <SidebarNavGroup>
            <SidebarItem 
              to="/productivity" 
              icon={<Calendar size={20} />} 
              label="Productivity" 
              expandable
              active={path.startsWith('/productivity')}
            />
          </SidebarNavGroup>
          
          <SidebarNavGroup>
            <SidebarItem 
              to="/finance" 
              icon={<DollarSign size={20} />} 
              label="Finance" 
              expandable
              active={path.startsWith('/finance')}
            />
          </SidebarNavGroup>
        </SidebarCategory>
        
        <SidebarCategory title="Personnel">
          <SidebarNavGroup>
            <SidebarItem 
              to="/personal" 
              icon={<User size={20} />} 
              label="Vue générale" 
              active={path === '/personal'}
            />
          </SidebarNavGroup>
          
          <SidebarNavGroup>
            <SidebarItem 
              to="/studies" 
              icon={<BookOpen size={20} />} 
              label="Études" 
              expandable
              active={path.startsWith('/studies')}
            />
          </SidebarNavGroup>
          
          <SidebarNavGroup>
            <SidebarItem 
              to="/fitness" 
              icon={<Activity size={20} />} 
              label="Fitness" 
              expandable
              active={path.startsWith('/fitness')}
            />
          </SidebarNavGroup>
        </SidebarCategory>
        
        <SidebarCategory title="Intelligence Artificielle">
          <SidebarNavGroup>
            <SidebarItem 
              to="/agent" 
              icon={<Bot size={20} />} 
              label="Agent Manager" 
              active={path.startsWith('/agent')}
            />
          </SidebarNavGroup>
          
          <SidebarNavGroup>
            <SidebarItem 
              to="/mcp" 
              icon={<Plug size={20} />} 
              label="Connecteurs MCP" 
              active={path.startsWith('/mcp')}
            />
          </SidebarNavGroup>
        </SidebarCategory>
      </div>
      
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
