import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface HomeViewProps {
  onNavigate: (view: 'gauss' | 'finite') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">{t('home.welcome')}</h2>
        <p className="text-lg text-slate-600">{t('home.intro')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {/* Gauss Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-start">
          <div className="bg-blue-100 p-3 rounded-lg mb-4">
             <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t('nav.gauss')}</h3>
          <p className="text-slate-600 mb-6 flex-grow">{t('home.gaussDesc')}</p>
          <button 
            onClick={() => onNavigate('gauss')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t('home.startGauss')}
          </button>
        </div>

        {/* Finite Field Card */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-start">
          <div className="bg-purple-100 p-3 rounded-lg mb-4">
             <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
             </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t('nav.finiteField')}</h3>
          <p className="text-slate-600 mb-6 flex-grow">{t('home.finiteDesc')}</p>
          <button 
            onClick={() => onNavigate('finite')}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm"
          >
            {t('home.startFinite')}
          </button>
        </div>
      </div>
    </div>
  );
};