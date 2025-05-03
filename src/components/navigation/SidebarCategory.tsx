
import React, { useState } from 'react';

interface SidebarCategoryProps {
  title: string;
  isOpenByDefault?: boolean;
  children: React.ReactNode;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({ title, isOpenByDefault = true, children }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  return (
    <div className="py-2">
      <div
        className="flex items-center px-4 py-2 text-sm font-medium cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">{isOpen ? '▼' : '►'}</span>
        <span>{title}</span>
      </div>
      
      {isOpen && (
        <div className="pl-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarCategory;
