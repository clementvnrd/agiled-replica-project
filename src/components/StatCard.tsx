
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  iconBg?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  iconBg = 'bg-blue-100'
}) => {
  return (
    <div className="agiled-card">
      <div className="flex items-center mb-3">
        {icon && (
          <div className={`w-8 h-8 rounded-md ${iconBg} flex items-center justify-center mr-3`}>
            {icon}
          </div>
        )}
        <h3 className="text-sm text-agiled-lightText font-medium">{title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        {change && (
          <div className="text-xs text-agiled-lightText">{change}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
