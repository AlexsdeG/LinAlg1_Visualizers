import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { RowOperation, RowOperationType } from '../types';
import { isValidFraction, toFraction } from '../lib/fraction-utils';

interface GaussControlsProps {
  matrixSize: number;
  onApply: (op: RowOperation) => void;
  disabled?: boolean;
}

export const GaussControls: React.FC<GaussControlsProps> = ({ matrixSize, onApply, disabled }) => {
  const { t } = useTranslation();
  const [opType, setOpType] = useState<RowOperationType>(RowOperationType.ADD);
  
  // State for inputs
  const [row1, setRow1] = useState<number>(0);
  const [row2, setRow2] = useState<number>(1);
  const [factorStr, setFactorStr] = useState<string>('1');

  // Rows options (0 to size-1)
  const rows = Array.from({ length: matrixSize }, (_, i) => i);

  // Validation
  const isFactorValid = isValidFraction(factorStr) && !toFraction(factorStr).equals(0);
  const isDiffRows = row1 !== row2;
  
  const canApply = !disabled && (
    opType === RowOperationType.SWAP ? isDiffRows :
    opType === RowOperationType.SCALE ? isFactorValid :
    opType === RowOperationType.ADD ? (isFactorValid && isDiffRows) : false
  );

  const handleApply = () => {
    if (!canApply) return;

    const factor = toFraction(factorStr);

    switch (opType) {
      case RowOperationType.SWAP:
        onApply({ type: RowOperationType.SWAP, row1, row2 });
        break;
      case RowOperationType.SCALE:
        onApply({ type: RowOperationType.SCALE, row: row1, factor });
        break;
      case RowOperationType.ADD:
        onApply({ type: RowOperationType.ADD, sourceRow: row1, targetRow: row2, factor });
        break;
    }
  };

  return (
    <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-end">
        
        {/* Operation Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-600">{t('controls.operation')}</label>
          <select 
            value={opType} 
            onChange={(e) => setOpType(e.target.value as RowOperationType)}
            className="p-2 rounded border border-slate-300 bg-white min-w-[140px]"
            disabled={disabled}
          >
            <option value={RowOperationType.ADD}>{t('controls.add')}</option>
            <option value={RowOperationType.SCALE}>{t('controls.scale')}</option>
            <option value={RowOperationType.SWAP}>{t('controls.swap')}</option>
          </select>
        </div>

        {/* Dynamic Inputs */}
        {opType === RowOperationType.SWAP && (
          <>
             <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.row1')}</label>
              <select 
                value={row1} 
                onChange={e => setRow1(Number(e.target.value))}
                className="p-2 rounded border border-slate-300 bg-white"
                disabled={disabled}
              >
                {rows.map(r => <option key={r} value={r}>R{r + 1}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.row2')}</label>
              <select 
                value={row2} 
                onChange={e => setRow2(Number(e.target.value))}
                className="p-2 rounded border border-slate-300 bg-white"
                disabled={disabled}
              >
                {rows.map(r => <option key={r} value={r}>R{r + 1}</option>)}
              </select>
            </div>
          </>
        )}

        {opType === RowOperationType.SCALE && (
          <>
             <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.row')}</label>
              <select 
                value={row1} 
                onChange={e => setRow1(Number(e.target.value))}
                className="p-2 rounded border border-slate-300 bg-white"
                disabled={disabled}
              >
                {rows.map(r => <option key={r} value={r}>R{r + 1}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.factor')}</label>
              <input
                type="text"
                value={factorStr}
                onChange={e => setFactorStr(e.target.value)}
                className={`p-2 rounded border bg-white w-24 ${!isFactorValid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                placeholder="e.g. 2, -1/2"
                disabled={disabled}
              />
            </div>
          </>
        )}

        {opType === RowOperationType.ADD && (
           <>
             {/* Add Source * k to Target */}
             <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.target')}</label>
              <select 
                value={row2} 
                onChange={e => setRow2(Number(e.target.value))}
                className="p-2 rounded border border-slate-300 bg-white"
                disabled={disabled}
              >
                {rows.map(r => <option key={r} value={r}>R{r + 1} &larr; ...</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2 font-bold text-slate-400">+</div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.factor')}</label>
              <input
                type="text"
                value={factorStr}
                onChange={e => setFactorStr(e.target.value)}
                className={`p-2 rounded border bg-white w-24 ${!isFactorValid ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                disabled={disabled}
              />
            </div>
            <div className="flex items-end pb-2 font-bold text-slate-400">&times;</div>
             <div className="flex flex-col gap-1">
              <label className="text-sm text-slate-600">{t('controls.source')}</label>
              <select 
                value={row1} 
                onChange={e => setRow1(Number(e.target.value))}
                className="p-2 rounded border border-slate-300 bg-white"
                disabled={disabled}
              >
                {rows.map(r => <option key={r} value={r}>R{r + 1}</option>)}
              </select>
            </div>
          </>
        )}

        <button
          onClick={handleApply}
          disabled={!canApply}
          className={`px-6 py-2 rounded font-semibold text-white transition-colors h-[42px] ${
            canApply ? 'bg-blue-600 hover:bg-blue-700 shadow-md' : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          {t('controls.apply')}
        </button>
      </div>
      
      {/* Help / Validation Text */}
      <div className="text-xs text-slate-500 h-4">
        {!isFactorValid && <span className="text-red-500">{t('controls.invalidFactor')}</span>}
        {opType === RowOperationType.ADD && !isDiffRows && <span className="text-red-500 ml-2">Source and Target must be different</span>}
      </div>
    </div>
  );
};