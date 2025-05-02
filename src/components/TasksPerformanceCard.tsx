
import React from 'react';

const TasksPerformanceCard: React.FC = () => {
  return (
    <div className="agiled-card h-full">
      <h3 className="text-lg font-medium mb-4">Tasks Performance</h3>
      
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="relative w-40 h-40">
          {/* Circular progress indicator */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#e9ecef" 
              strokeWidth="10"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="10"
              strokeDasharray="282.74"
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="10"
              strokeDasharray="282.74"
              strokeDashoffset="282.74"
              transform="rotate(-90 50 50)"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="10"
              strokeDasharray="282.74"
              strokeDashoffset="282.74"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <div>
            <div className="font-medium">0%</div>
            <div className="text-xs text-agiled-lightText">Completed</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <div>
            <div className="font-medium">0%</div>
            <div className="text-xs text-agiled-lightText">Pending</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <div>
            <div className="font-medium">100%</div>
            <div className="text-xs text-agiled-lightText">Assigned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPerformanceCard;
