
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IllustrationProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Illustration: React.FC<IllustrationProps> = ({
  icon: Icon,
  title,
  description,
  color = "#3b82f6",
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48
  };

  return (
    <div className={`flex flex-col items-center text-center p-6 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center mb-4`}
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={iconSizes[size]} />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
    </div>
  );
};

export { Illustration };
