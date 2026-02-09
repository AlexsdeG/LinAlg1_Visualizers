import React from 'react';
import { Card } from './Card';
import { useTranslation } from '../../../hooks/useTranslation';

interface CalculationCardProps {
  children: React.ReactNode;
}

export const CalculationCard: React.FC<CalculationCardProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <Card 
      title={t('learn.calculation')} 
      icon={
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" x2="12" y1="10" y2="14"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
      }
      colorClass="text-purple-500"
    >
      {children}
    </Card>
  );
};
