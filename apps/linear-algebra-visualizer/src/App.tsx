import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MatrixControl } from './modules/linalg/components/MatrixControl';
import { TransformationView } from './modules/linalg/views/TransformationView';
import { EigenView } from './modules/linalg/views/EigenView';
import { BasisChangeView } from './modules/linalg/views/BasisChangeView';
import { identityMatrix, Matrix2D } from './modules/linalg/utils';

type TabId = 'transform' | 'eigen' | 'basis';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [matrix, setMatrix] = useState<Matrix2D>(identityMatrix());
  const [activeTab, setActiveTab] = useState<TabId>('transform');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
               A
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-tight">{t('app.title')}</h1>
               <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                 {t('app.subtitle')}
               </p>
             </div>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            {i18n.language.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Side - Always visible */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                {t('matrix.control.title')}
              </h2>
              <MatrixControl 
                value={matrix} 
                onChange={setMatrix} 
              />
            </div>

            {/* Debug Info */}
            <div className="bg-gray-800 text-gray-200 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <h3 className="uppercase tracking-wider text-gray-500 mb-2 font-bold">State Debug</h3>
              <pre>{JSON.stringify(matrix, null, 2)}</pre>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-8">
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-1 min-h-[500px] flex flex-col">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setActiveTab('transform')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                      activeTab === 'transform' 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                    }`}
                  >
                    {t('tabs.transform')}
                  </button>
                  <button
                    onClick={() => setActiveTab('eigen')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                      activeTab === 'eigen' 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                    }`}
                  >
                    {t('tabs.eigen')}
                  </button>
                  <button
                    onClick={() => setActiveTab('basis')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 ${
                      activeTab === 'basis' 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
                    }`}
                  >
                    {t('tabs.basis')}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 flex-grow">
                  {activeTab === 'transform' && (
                    <TransformationView matrix={matrix} setMatrix={setMatrix} />
                  )}
                  {activeTab === 'eigen' && (
                    <EigenView matrix={matrix} setMatrix={setMatrix} />
                  )}
                  {activeTab === 'basis' && (
                    <BasisChangeView matrix={matrix} setMatrix={setMatrix} />
                  )}
                </div>
             </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 dark:text-gray-600 text-xs flex-none">
        Linear Algebra Visualizer v0.0.5 &bull; Interactive Learning Tool
      </footer>
    </div>
  );
};

export default App;