import React, { useMemo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useGaussGame } from '../hooks/useGaussGame';
import { GaussControls } from '../components/GaussControls';
import { FractionDisplay } from '../components/FractionDisplay';
import { AnalysisCard } from '../components/AnalysisCard';
import { CalculationCard } from '../components/CalculationCard';
import { DefinitionCard } from '../components/DefinitionCard';
import { HowItWorksCard } from '../components/HowItWorksCard';
import { BackSubstitutionTrainer } from '../components/BackSubstitutionTrainer';

export const GaussTrainer: React.FC = () => {
  const { t } = useTranslation();
  const {
    matrix, isSolved,
    size, setSize,
    difficulty, setDifficulty,
    applyOp, undo, redo, reset, canUndo, canRedo
  } = useGaussGame(3);

  // Analysis Logic: Count correct Pivot columns (1 on diag, 0 elsewhere)
  const solvedColumns = useMemo(() => {
    if (matrix.length === 0) return 0;
    let count = 0;
    // Only check the square coefficient part (columns 0 to rows-1)
    const numColsToCheck = matrix.length;
    for (let col = 0; col < numColsToCheck; col++) {
      let isCorrect = true;
      for (let row = 0; row < matrix.length; row++) {
        const val = matrix[row][col];
        // For RREF/Identity: Diagonal should be 1, others 0
        const target = row === col ? 1 : 0;
        if (!val.equals(target)) {
          isCorrect = false;
          break;
        }
      }
      if (isCorrect) count++;
    }
    return count;
  }, [matrix]);

  if (matrix.length === 0) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t('trainer.title')}</h2>
            <p className="text-slate-500">{t('trainer.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1 text-sm rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('trainer.undo')}
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1 text-sm rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('trainer.redo')}
            </button>
            <button
              onClick={reset}
              className="px-3 py-1 text-sm rounded bg-slate-800 text-white hover:bg-slate-700 ml-2"
            >
              {t('trainer.reset')}
            </button>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="flex gap-6 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-600">Size:</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="p-1 rounded border border-slate-300 text-sm"
            >
              {[2, 3, 4, 5].map(s => <option key={s} value={s}>{s} × {s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-600">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="p-1 rounded border border-slate-300 text-sm"
            >
              <option value={1}>Level 1 (Simple)</option>
              <option value={2}>Level 2 (Medium)</option>
              <option value={3}>Level 3 (Hard)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col items-center gap-8">

        {/* Matrix Visualization */}
        <div className="relative p-8 bg-white rounded-xl shadow-lg border border-slate-100">
          {/* Brackets */}
          <div className="absolute top-4 bottom-4 left-4 w-4 border-l-2 border-t-2 border-b-2 border-slate-800 rounded-l-lg"></div>
          <div className="absolute top-4 bottom-4 right-4 w-4 border-r-2 border-t-2 border-b-2 border-slate-800 rounded-r-lg"></div>

          <div
            className="grid gap-x-8 gap-y-4 px-6 transition-all duration-300 ease-in-out"
            style={{
              gridTemplateColumns: `auto repeat(${matrix[0].length}, minmax(60px, auto))`
            }}
          >
            {matrix.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Row Label */}
                <div className="flex items-center justify-end text-slate-400 font-mono text-sm select-none pr-2">
                  R{rowIndex + 1}
                </div>

                {/* Row Cells */}
                {row.map((val, colIndex) => {
                  // Highlight logic:
                  // 1. If it's a pivot candidate (1 on diagonal), highlight blue.
                  // 2. If it's 0, dim it.
                  const isPivot = rowIndex === colIndex && val.equals(1);
                  const isZero = val.equals(0);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`h-12 flex items-center justify-center transition-all duration-300 ${isZero ? 'opacity-30' : 'opacity-100'
                        }`}
                    >
                      <FractionDisplay value={val} highlight={isPivot} className="text-xl" />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Status Message */}
        {isSolved && (
          <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-bold border border-green-200 animate-bounce">
            {t('trainer.solved')}
          </div>
        )}

        {/* Controls */}
        <div className="w-full">
          <GaussControls
            matrixSize={matrix.length}
            onApply={applyOp}
            disabled={isSolved}
          />
        </div>

        {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">

          <HowItWorksCard
            steps={[
              { title: t('learn.gauss.how.step1.title'), description: t('learn.gauss.how.step1.desc') },
              { title: t('learn.gauss.how.step2.title'), description: t('learn.gauss.how.step2.desc') },
              { title: t('learn.gauss.how.step3.title'), description: t('learn.gauss.how.step3.desc') }
            ]}
          />

          <AnalysisCard>
            <div className="flex justify-between">
              <span>{t('learn.gauss.analysis.size')}:</span>
              <span className="font-mono font-bold">{matrix.length} &times; {matrix[0].length}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('learn.gauss.analysis.pivots')}:</span>
              <span className={`font-mono font-bold ${solvedColumns === matrix.length ? 'text-green-600' : 'text-orange-500'}`}>
                {solvedColumns} / {matrix.length}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span>{t('learn.gauss.analysis.status')}:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${isSolved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {isSolved ? t('learn.gauss.analysis.solved') : t('learn.gauss.analysis.wip')}
              </span>
            </div>
          </AnalysisCard>

          <CalculationCard>
            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-1">Row Operations</div>
            <p className="font-mono text-xs bg-slate-50 p-1 rounded">R<sub>i</sub> &harr; R<sub>j</sub></p>
            <p className="text-xs text-slate-500 mb-2">{t('learn.gauss.calc.swap')}</p>

            <p className="font-mono text-xs bg-slate-50 p-1 rounded">R<sub>i</sub> &larr; k &middot; R<sub>i</sub></p>
            <p className="text-xs text-slate-500 mb-2">{t('learn.gauss.calc.scale')}</p>

            <p className="font-mono text-xs bg-slate-50 p-1 rounded">R<sub>i</sub> &larr; R<sub>i</sub> + k &middot; R<sub>j</sub></p>
            <p className="text-xs text-slate-500">{t('learn.gauss.calc.add')}</p>
          </CalculationCard>

          <DefinitionCard title={t('learn.gauss.def.title')}>
            <p>
              {t('learn.gauss.def.body')}
            </p>
          </DefinitionCard>

        </div>

      </div>



      {/* Back Substitution Section */}
      <div className="mt-12 pt-8 border-t border-slate-200 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Back Substitution Practice</h2>
            <p className="text-slate-500">Practice solving triangular systems (REF) by finding variables one by one.</p>
          </div>
        </div>
        <BackSubstitutionTrainer size={size} />
      </div>

    </div >
  );
};