
import React from 'react';

interface EmptyCardProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const EmptyCard: React.FC<EmptyCardProps> = ({ title, message, icon }) => {
  return (
    <div className="agiled-card h-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="flex flex-col items-center justify-center py-8 text-agiled-lightText">
        {icon && <div className="mb-3">{icon}</div>}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EmptyCard;
