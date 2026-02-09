import React from 'react';
import { useTranslation } from 'react-i18next';
import { Matrix2D, identityMatrix, getDeterminant } from '../utils';

interface MatrixControlProps {
  value: Matrix2D;
  onChange: (newValue: Matrix2D) => void;
  className?: string;
}

export const MatrixControl: React.FC<MatrixControlProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const det = getDeterminant(value);
  const isSingular = Math.abs(det) < 1e-6;

  const handleChange = (key: keyof Matrix2D, numStr: string) => {
    const num = parseFloat(numStr);
    if (!isNaN(num)) {
      onChange({ ...value, [key]: num });
    } else if (numStr === '' || numStr === '-') {
       // Allow typing negative signs
    }
  };

  const MatrixInput = ({
    val,
    field,
    colorClass,
  }: {
    val: number;
    field: keyof Matrix2D;
    colorClass: string;
  }) => (
    <div className="relative group">
        <input
        type="number"
        step="0.1"
        value={val}
        onChange={(e) => handleChange(field, e.target.value)}
        className={`w-24 text-center p-3 text-xl font-mono rounded-lg bg-white dark:bg-gray-800 border-2 ${colorClass} focus:ring-4 focus:ring-opacity-20 outline-none transition-all shadow-sm z-10 relative`}
        />
    </div>
  );

  return (
    <div className={`p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t('matrix.control.title')}
        </h3>
        <button
          onClick={() => onChange(identityMatrix())}
          className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 transition-colors font-medium border border-transparent dark:border-gray-700"
        >
          {t('matrix.reset')}
        </button>
      </div>

      {/* Visual Matrix Container */}
      <div className="flex flex-col items-center mb-8">
        
        {/* Column Headers */}
        <div className="flex w-full justify-center gap-16 mb-3 pl-10">
            <div className="flex flex-col items-center group cursor-help" title="Basis Vector i-hat (Column 1)">
                <span className="font-serif italic text-2xl font-bold text-green-600 mb-1">î</span>
                <span className="text-[10px] uppercase tracking-wider text-green-700/60 dark:text-green-400/60 font-bold border-b border-green-200 dark:border-green-800 pb-0.5">{t('common.column')} 1</span>
            </div>
            <div className="flex flex-col items-center group cursor-help" title="Basis Vector j-hat (Column 2)">
                <span className="font-serif italic text-2xl font-bold text-red-600 mb-1">ĵ</span>
                <span className="text-[10px] uppercase tracking-wider text-red-700/60 dark:text-red-400/60 font-bold border-b border-red-200 dark:border-red-800 pb-0.5">{t('common.column')} 2</span>
            </div>
        </div>

        <div className="flex items-center">
          {/* Row Labels */}
          <div className="flex flex-col justify-around h-40 mr-5 font-serif italic text-gray-400 dark:text-gray-500 text-xl font-medium select-none">
            <span>x</span>
            <span>y</span>
          </div>

          {/* Matrix Structure */}
          <div className="flex items-center">
            {/* Left Bracket */}
            <div className="w-8 h-44 border-l-4 border-t-4 border-b-4 border-gray-800 dark:border-gray-300 rounded-l-2xl"></div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-6 py-4">
               {/* Row 1: x components */}
               <MatrixInput 
                 val={value.ix} 
                 field="ix" 
                 colorClass="border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-300 focus:border-green-500 focus:ring-green-500" 
               />
               <MatrixInput 
                 val={value.jx} 
                 field="jx" 
                 colorClass="border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 focus:border-red-500 focus:ring-red-500" 
               />
               
               {/* Row 2: y components */}
               <MatrixInput 
                 val={value.iy} 
                 field="iy" 
                 colorClass="border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-300 focus:border-green-500 focus:ring-green-500" 
               />
               <MatrixInput 
                 val={value.jy} 
                 field="jy" 
                 colorClass="border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 focus:border-red-500 focus:ring-red-500" 
               />
            </div>

            {/* Right Bracket */}
            <div className="w-8 h-44 border-r-4 border-t-4 border-b-4 border-gray-800 dark:border-gray-300 rounded-r-2xl"></div>
          </div>
        </div>
      </div>

      {/* Determinant Footer */}
      <div className={`p-4 rounded-xl border flex justify-between items-center transition-all duration-300 ${
          isSingular 
            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' 
            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
        }`}>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-serif italic text-lg">
                det(A)
            </span>
            <span className="text-gray-300 dark:text-gray-600">=</span>
        </div>
        
        <div className="flex flex-col items-end">
            <span className={`font-mono text-2xl font-bold tracking-tight ${isSingular ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {det.toFixed(2)}
            </span>
            {isSingular && (
                <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider mt-1">
                   {t('matrix.singular')}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};