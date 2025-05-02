
import React from 'react';
import StatCard from '@/components/StatCard';
import { LucideIcon } from 'lucide-react';

export interface StatItem {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  iconBg?: string;
}

interface StatCardGroupProps {
  items: StatItem[];
}

const StatCardGroup: React.FC<StatCardGroupProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {items.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          change={item.change}
          iconBg={item.iconBg}
        />
      ))}
    </div>
  );
};

export default StatCardGroup;
