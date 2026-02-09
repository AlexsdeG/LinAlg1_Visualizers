import React, { useState } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { GaussTrainer } from './modules/trainer/views/GaussTrainer';
import { FiniteFieldTrainer } from './modules/trainer/views/FiniteFieldTrainer';
import { HomeView } from './views/HomeView';

type ViewState = 'home' | 'gauss' | 'finite';

const App: React.FC = () => {
  const { t, locale, setLocale } = useTranslation();
  const [activeTab, setActiveTab] = useState<ViewState>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Bar */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-4 border-b border-slate-200 gap-4">
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{t('app.title')}</h1>
            <p className="text-slate-500 text-sm md:text-base mt-1">{t('app.description')}</p>
          </div>
          
          <div className="flex items-center gap-4 self-end md:self-auto">
             {/* Nav Tabs */}
             <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => setActiveTab('gauss')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'gauss' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('nav.gauss')}
                </button>
                <button
                  onClick={() => setActiveTab('finite')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'finite' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('nav.finiteField')}
                </button>
             </div>

            {/* Language Switcher */}
            <div className="flex gap-1 border-l pl-4 border-slate-300">
              <button 
                onClick={() => setLocale('en')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${locale === 'en' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border hover:bg-slate-50'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLocale('de')}
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${locale === 'de' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border hover:bg-slate-50'}`}
              >
                DE
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[600px]">
          {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
          {activeTab === 'gauss' && <GaussTrainer />}
          {activeTab === 'finite' && <FiniteFieldTrainer />}
        </main>
      </div>
    </div>
  );
};

export default App;