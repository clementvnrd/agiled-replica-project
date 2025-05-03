
import React from 'react';
import SidebarItem from './SidebarItem';
import { Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SidebarFooter: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="mt-auto">
      <div className="px-4 py-3 bg-blue-50 border-t border-agiled-lightBorder">
        <div className="text-sm">
          <p className="text-center mb-1">Intégrations: Strava, OpenRouter</p>
          <button className="btn-primary w-full">Connecter + d'outils</button>
        </div>
      </div>
      <div className="p-3 border-t border-agiled-lightBorder">
        <SidebarItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          label="Paramètres"
          active={path.startsWith('/settings')}
        />
      </div>
    </div>
  );
};

export default SidebarFooter;
