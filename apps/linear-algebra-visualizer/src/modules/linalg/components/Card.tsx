import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  colorClass?: string;
  children: React.ReactNode;
  className?: string; // Additional classes for the container
}

export const Card: React.FC<CardProps> = ({ title, icon, colorClass = 'text-gray-600 dark:text-gray-400', children, className = '' }) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700/50">
        {icon && (
          <span className={colorClass}>
            {icon}
          </span>
        )}
        <h4 className={`font-bold uppercase text-xs tracking-wider ${colorClass}`}>{title}</h4>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 flex-1">
        {children}
      </div>
    </div>
  );
};
