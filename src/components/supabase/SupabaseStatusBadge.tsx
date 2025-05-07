
import React from 'react';

interface SupabaseStatusBadgeProps {
  status: boolean | null;
}

const SupabaseStatusBadge: React.FC<SupabaseStatusBadgeProps> = ({ status }) => {
  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        status === null ? 'bg-gray-500' : status ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <span 
        className="w-2 h-2 rounded-full mr-2 inline-block" 
        style={{ background: status === null ? '#888' : status ? '#22c55e' : '#ef4444' }}
      />
      {status === null ? '...' : status ? 'Connected' : 'Offline'}
    </span>
  );
};

export default SupabaseStatusBadge;
