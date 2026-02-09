import React from 'react';
import { Card } from './Card';
import { useTranslation } from '../../../hooks/useTranslation';

interface DefinitionCardProps {
  title?: string;
  children: React.ReactNode;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({ title, children }) => {
  const { t } = useTranslation();
  return (
    <Card 
      title={t('learn.definition')} 
      icon={
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      }
      colorClass="text-amber-500"
    >
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div className="leading-relaxed">
        {children}
      </div>
    </Card>
  );
};
