import React from 'react';
import { Card } from './Card';
import { useTranslation } from '../../../hooks/useTranslation';

interface HowItWorksCardProps {
  steps: {
    title?: string;
    description: string;
  }[];
}

export const HowItWorksCard: React.FC<HowItWorksCardProps> = ({ steps }) => {
  const { t } = useTranslation();

  return (
    <Card 
      title={t('learn.howItWorks')} 
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
      }
      colorClass="text-green-600"
      className="md:col-span-3 lg:col-span-1" // Often used in a grid, can span full width or be a side card
    >
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-4 border-l-2 border-green-100">
            {step.title && <div className="font-semibold text-xs text-green-700 mb-0.5">{step.title}</div>}
            <p className="text-xs leading-relaxed text-slate-600">
              {step.description}
            </p>
            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-green-200"></div>
          </div>
        ))}
      </div>
    </Card>
  );
};
