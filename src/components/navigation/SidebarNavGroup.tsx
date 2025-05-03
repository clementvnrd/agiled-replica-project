
import React from 'react';

interface SidebarNavGroupProps {
  children: React.ReactNode;
}

const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({ children }) => {
  return (
    <div className="px-3 sidebar-nav-group">
      {children}
    </div>
  );
};

export default SidebarNavGroup;
