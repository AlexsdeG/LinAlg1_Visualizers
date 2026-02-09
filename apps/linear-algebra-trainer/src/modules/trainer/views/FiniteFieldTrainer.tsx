import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { ModuloGrid } from '../components/ModuloGrid';
import { modAdd, modSub, modMul, modDivDetails, safeMod, isPrime } from '../lib/finite-field';
import { AnalysisCard } from '../components/AnalysisCard';
import { CalculationCard } from '../components/CalculationCard';
import { DefinitionCard } from '../components/DefinitionCard';
import { HowItWorksCard } from '../components/HowItWorksCard';

export const FiniteFieldTrainer: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [modulus, setModulus] = useState<number>(7);
  const [valA, setValA] = useState<number>(3);
  const [valB, setValB] = useState<number>(4);
  const [result, setResult] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Visual state for grid
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [activeCol, setActiveCol] = useState<number | null>(null);

  const handleCalculate = (op: '+' | '-' | '*' | '/') => {
    setError(null);
    setLogs([]);
    setResult(null);
    setActiveRow(null);
    setActiveCol(null);

    // Validate inputs
    const m = Math.max(2, Math.floor(modulus));
    const a = safeMod(Math.floor(valA), m);
    const b = safeMod(Math.floor(valB), m);
    
    // Update inputs to normalized values (optional, but good for clarity)
    // setValA(a); setValB(b);

    let res = 0;
    const newLogs: string[] = [];

    switch(op) {
      case '+':
        res = modAdd(a, b, m);
        newLogs.push(`${t('ff.step.add')} ${a} + ${b} = ${a+b}`);
        newLogs.push(`${a+b} mod ${m} = ${res}`);
        break;
      case '-':
        res = modSub(a, b, m);
        newLogs.push(`${t('ff.step.sub')} ${a} - ${b} = ${a-b}`);
        newLogs.push(`${a-b} mod ${m} = ${res}`);
        break;
      case '*':
        res = modMul(a, b, m);
        setActiveRow(a);
        setActiveCol(b);
        newLogs.push(`${t('ff.step.mul')} ${a} ⋅ ${b} = ${a*b}`);
        newLogs.push(`${a*b} mod ${m} = ${res}`);
        break;
      case '/':
        newLogs.push(`${t('ff.step.div')} ${a} / ${b} (mod ${m})`);
        const divData = modDivDetails(a, b, m);
        if (divData.error) {
          setError(divData.error);
          newLogs.push(...divData.steps);
          setLogs(newLogs);
          return;
        }
        res = divData.result as number;
        newLogs.push(...divData.steps);
        break;
    }

    setResult(res);
    setLogs(newLogs);
  };

  const modulusIsPrime = isPrime(modulus);
  const calcSum = (valA + valB) % modulus;
  const calcDiff = safeMod(valA - valB, modulus);
  const calcProd = (valA * valB) % modulus;

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('ff.title')}</h2>
        <p className="text-slate-500">{t('ff.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Col: Controls & Log */}
        <div className="flex flex-col gap-6">
          
          {/* Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('ff.modulus')}</label>
            <input 
              type="number" 
              min="2"
              max="99"
              value={modulus}
              onChange={(e) => setModulus(parseInt(e.target.value) || 2)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={t('ff.placeholder.mod')}
            />
          </div>

          {/* Calculator */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-4 text-slate-800">{t('ff.calc.title')}</h3>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('ff.calc.a')}</label>
                <input 
                  type="number" 
                  value={valA}
                  onChange={(e) => setValA(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded text-center font-mono text-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">{t('ff.calc.b')}</label>
                <input 
                  type="number" 
                  value={valB}
                  onChange={(e) => setValB(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded text-center font-mono text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              <button onClick={() => handleCalculate('+')} className="bg-slate-100 hover:bg-slate-200 p-3 rounded font-bold text-slate-700">+</button>
              <button onClick={() => handleCalculate('-')} className="bg-slate-100 hover:bg-slate-200 p-3 rounded font-bold text-slate-700">−</button>
              <button onClick={() => handleCalculate('*')} className="bg-slate-100 hover:bg-slate-200 p-3 rounded font-bold text-slate-700">×</button>
              <button onClick={() => handleCalculate('/')} className="bg-slate-100 hover:bg-slate-200 p-3 rounded font-bold text-slate-700">÷</button>
            </div>

            {/* Results Area */}
            <div className="bg-slate-50 rounded p-4 border border-slate-100 min-h-[120px]">
              <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                <span className="text-sm font-semibold text-slate-500">{t('ff.calc.res')}</span>
                {result !== null && <span className="text-2xl font-bold text-blue-600">{result}</span>}
                {error && <span className="text-sm font-bold text-red-500">{t(error as any)}</span>}
              </div>
              
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-sm text-slate-600 font-mono">
                    {i === logs.length - 1 && !error ? '➤ ' : '• '} {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Grid */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-slate-800">{t('ff.grid.title')} (×)</h3>
              <div className="text-xs text-slate-500 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                Green cells = 1 (Inverses)
              </div>
            </div>
            <ModuloGrid 
              modulus={Math.min(modulus, 20)} 
              highlightNumber={1} 
              activeRow={activeRow}
              activeCol={activeCol}
            />
            {modulus > 20 && <p className="text-xs text-slate-400 mt-2 text-center">Grid limited to 20x20 for performance.</p>}
          </div>
        </div>
      </div>

       {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          
          <HowItWorksCard 
            steps={[
              { title: t('learn.ff.how.step1.title'), description: t('learn.ff.how.step1.desc') },
              { title: t('learn.ff.how.step2.title'), description: t('learn.ff.how.step2.desc') },
              { title: t('learn.ff.how.step3.title'), description: t('learn.ff.how.step3.desc') }
            ]}
          />

          <AnalysisCard>
             <div className="flex justify-between">
               <span>{t('ff.modulus')}:</span>
               <span className="font-mono font-bold text-lg">{modulus}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className={`px-2 py-0.5 rounded text-xs font-bold ${modulusIsPrime ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                 {modulusIsPrime ? t('learn.ff.analysis.prime') : t('learn.ff.analysis.comp')}
               </span>
             </div>
             <p className="text-xs pt-2 border-t border-slate-100 mt-2 leading-relaxed">
                {modulusIsPrime ? t('learn.ff.analysis.field') : t('learn.ff.analysis.ring')}
             </p>
          </AnalysisCard>

          <CalculationCard>
             <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">{t('learn.ff.calc.vars')}</div>
             <div className="flex gap-4 mb-3">
               <div className="bg-slate-50 px-2 py-1 rounded font-mono">A = {valA}</div>
               <div className="bg-slate-50 px-2 py-1 rounded font-mono">B = {valB}</div>
               <div className="bg-slate-50 px-2 py-1 rounded font-mono">P = {modulus}</div>
             </div>
             
             <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">Preview</div>
             <ul className="space-y-1 font-mono text-xs">
               <li>{valA} + {valB} &equiv; {calcSum} (mod {modulus})</li>
               <li>{valA} - {valB} &equiv; {calcDiff} (mod {modulus})</li>
               <li>{valA} * {valB} &equiv; {calcProd} (mod {modulus})</li>
             </ul>
          </CalculationCard>

          <DefinitionCard title={t('learn.ff.def.title')}>
             <p>
               {t('learn.ff.def.body')}
             </p>
          </DefinitionCard>

        </div>

    </div>
  );
};