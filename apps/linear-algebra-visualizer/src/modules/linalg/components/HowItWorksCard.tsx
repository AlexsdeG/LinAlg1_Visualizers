import React from 'react';
import { Card } from './Card';
import { useTranslation } from 'react-i18next';

interface HowItWorksCardProps {
  steps: {
    text: string;
    highlight?: string;
  }[];
}

export const HowItWorksCard: React.FC<HowItWorksCardProps> = ({ steps }) => {
  const { t } = useTranslation();
  return (
    <Card 
      title={t('education.titles.howItWorks')} 
      colorClass="text-green-700 dark:text-green-400"
      className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 md:col-span-3"
    >
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {steps.map((step, i) => (
           <div key={i} className="flex items-start gap-3">
             <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 flex items-center justify-center text-xs font-bold">
               {i + 1}
             </div>
             <p className="text-sm">
               {step.text} {step.highlight && <span className="font-bold text-green-600 dark:text-green-300 block mt-1">{step.highlight}</span>}
             </p>
           </div>
         ))}
       </div>
    </Card>
  );
};
