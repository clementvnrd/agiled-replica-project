
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ViewAllLinkProps {
  to: string;
  label?: string;
}

const ViewAllLink: React.FC<ViewAllLinkProps> = ({ to, label = "View all" }) => {
  return (
    <div className="flex justify-center mt-4">
      <Link 
        to={to} 
        className="text-agiled-primary flex items-center hover:underline font-medium"
      >
        {label} 
        <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default ViewAllLink;
