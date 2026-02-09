import React from 'react';
import { Card } from './Card';
import { useTranslation } from 'react-i18next';

interface AnalysisCardProps {
  children: React.ReactNode;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <Card 
      title={t('education.titles.analysis')} 
      colorClass="text-blue-700 dark:text-blue-300"
      className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"
    >
      {children}
    </Card>
  );
};
