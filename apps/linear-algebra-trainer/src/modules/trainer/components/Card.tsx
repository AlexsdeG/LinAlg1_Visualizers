import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  colorClass?: string;
  children: React.ReactNode;
  className?: string; // Additional classes for the container
}

export const Card: React.FC<CardProps> = ({ title, icon, colorClass = 'text-slate-700', children, className = '' }) => {
  return (
    <div className={`bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
        {icon && (
          <span className={colorClass}>
            {icon}
          </span>
        )}
        <h3 className="font-bold text-slate-700">{title}</h3>
      </div>
      <div className="text-sm space-y-2 text-slate-600 flex-1">
        {children}
      </div>
    </div>
  );
};
