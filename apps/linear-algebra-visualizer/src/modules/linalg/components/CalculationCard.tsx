import React from 'react';
import { Card } from './Card';
import { useTranslation } from 'react-i18next';

interface CalculationCardProps {
  children: React.ReactNode;
}

export const CalculationCard: React.FC<CalculationCardProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <Card 
      title={t('education.titles.calculation')} 
      colorClass="text-gray-600 dark:text-gray-400"
    >
      {children}
    </Card>
  );
};
