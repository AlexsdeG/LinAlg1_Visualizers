import React from 'react';
import { Card } from './Card';
import { useTranslation } from 'react-i18next';

interface DefinitionCardProps {
  children: React.ReactNode;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <Card 
      title={t('education.titles.definition')} 
      colorClass="text-amber-700 dark:text-amber-400"
      className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
    >
      {children}
    </Card>
  );
};
