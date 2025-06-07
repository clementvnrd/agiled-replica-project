import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, Clock, Plug, Database, FileText, FolderOpen, Calendar } from 'lucide-react';
import SidebarCategory from './navigation/SidebarCategory';
import SidebarItem from './navigation/SidebarItem';
import SidebarFooter from './navigation/SidebarFooter';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="w-64 h-screen bg-white border-r border-agiled-lightBorder flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-agiled-lightBorder">
        <img src="/logo.svg" alt="Agiled Logo" className="h-8" />
      </div>
      
      <div className="px-4 py-2 border-b border-agiled-lightBorder">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-agiled-lightText">john.doe@example.com</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <SidebarItem 
          to="/dashboard" 
          icon={<Home size={20} />} 
          label="Dashboard"
          active={path === '/dashboard'}
        />
        
        <SidebarCategory title="Business">
          <SidebarItem 
            to="/projects" 
            icon={<FolderOpen size={20} />} 
            label="Projets"
            active={path.startsWith('/projects')}
          />
          <SidebarItem 
            to="/calendar" 
            icon={<Calendar size={20} />} 
            label="Calendrier"
            active={path.startsWith('/calendar')}
          />
          <SidebarItem 
            to="/customers" 
            icon={<Users size={20} />} 
            label="Clients"
            active={path.startsWith('/customers')}
          />
          <SidebarItem 
            to="/integrations" 
            icon={<Plug size={20} />} 
            label="Intégrations"
            active={path.startsWith('/integrations')}
          />
        </SidebarCategory>

        <SidebarCategory title="Système RAG">
          <SidebarItem 
            to="/rag" 
            icon={<Database size={20} />} 
            label="Documents RAG"
            active={path.startsWith('/rag')}
          />
        </SidebarCategory>
      </nav>

      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
