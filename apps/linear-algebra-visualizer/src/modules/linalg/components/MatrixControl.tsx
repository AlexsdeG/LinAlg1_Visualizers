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
       // Allow empty or negative sign during typing, handled by controlling input value but updating state carefully
       // For simplicity in this demo, we might skip partial state updates or handle them in local state.
       // Here we just ignore invalid numbers for safety.
    }
  };

  const InputField = ({
    label,
    val,
    field,
    colorClass,
  }: {
    label: string;
    val: number;
    field: keyof Matrix2D;
    colorClass: string;
  }) => (
    <div className="flex flex-col">
      <label className={`text-xs font-semibold mb-1 ${colorClass}`}>{label}</label>
      <input
        type="number"
        step="0.1"
        value={val}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
      />
    </div>
  );

  return (
    <div className={`p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t('matrix.control.title')}
        </h3>
        <button
          onClick={() => onChange(identityMatrix())}
          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
        >
          {t('matrix.reset')}
        </button>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center mb-4">
        {/* Left Bracket */}
        <div className="row-span-2 w-2 border-l-2 border-t-2 border-b-2 border-gray-800 dark:border-gray-400 rounded-l h-full"></div>

        {/* Matrix Inputs */}
        {/* Row 1 */}
        <InputField label={`i_x (${t('common.column')} 1)`} val={value.ix} field="ix" colorClass="text-green-600" />
        <InputField label={`j_x (${t('common.column')} 2)`} val={value.jx} field="jx" colorClass="text-red-600" />

        {/* Row 2 */}
        <InputField label={`i_y (${t('common.column')} 1)`} val={value.iy} field="iy" colorClass="text-green-600" />
        <InputField label={`j_y (${t('common.column')} 2)`} val={value.jy} field="jy" colorClass="text-red-600" />

        {/* Right Bracket */}
        <div className="row-span-2 w-2 border-r-2 border-t-2 border-b-2 border-gray-800 dark:border-gray-400 rounded-r h-full"></div>
      </div>

      <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">{t('matrix.determinant')}:</span>
          <span className={`font-mono font-bold ${isSingular ? 'text-red-500' : 'text-blue-600'}`}>
            {det.toFixed(2)}
          </span>
        </div>
        {isSingular && (
          <div className="mt-2 text-xs text-red-500 font-medium text-center">
            ⚠️ {t('matrix.singular')}
          </div>
        )}
      </div>
    </div>
  );
};
