import React from 'react';
import { modAdd, modSub, modMul, modInverse } from '../lib/finite-field';

interface ModuloGridProps {
  modulus: number;
  highlightNumber?: number | null; // e.g. highlighting where '1' is
  activeRow?: number | null; // for calculator interaction
  activeCol?: number | null; // for calculator interaction
  operation?: '+' | '-' | '*' | '/';
}

export const ModuloGrid: React.FC<ModuloGridProps> = ({
  modulus,
  highlightNumber,
  activeRow,
  activeCol,
  operation = '*'
}) => {
  // Safety cap to prevent browser crash
  if (modulus > 20) {
    return (
      <div className="p-4 border border-slate-200 rounded text-slate-500 italic bg-slate-50">
        Grid too large to display efficiently (&gt;20).
      </div>
    );
  }

  const range = Array.from({ length: modulus }, (_, i) => i);

  // Helper to calculate cell value and status
  const getCellData = (r: number, c: number) => {
    let val: number | string = '?';
    let isCompromised = false; // Red invalid
    let isZeroDivisor = false; // Orange warning (optional)

    try {
      switch (operation) {
        case '+':
          val = modAdd(r, c, modulus);
          break;
        case '-':
          val = modSub(r, c, modulus);
          break;
        case '*':
          val = modMul(r, c, modulus);
          // Check for Zero Divisor: if result is 0 but inputs are non-zero
          if (val === 0 && r !== 0 && c !== 0) {
            isCompromised = true;
          }
          break;
        case '/':
          if (c === 0) {
            val = '-';
            isCompromised = true; // Division by zero
          } else {
            const inv = modInverse(c, modulus);
            if (inv === null) {
              val = '-';
              isCompromised = true; // No inverse exists
            } else {
              val = modMul(r, inv, modulus);
            }
          }
          break;
      }
    } catch (e) {
      val = 'Err';
    }

    return { val, isCompromised, isZeroDivisor };
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `auto repeat(${modulus}, minmax(30px, 1fr))` }}
      >
        {/* Header Row */}
        <div className="flex items-center justify-center font-bold text-slate-400 h-8 w-8 bg-slate-50 rounded">
          {operation}
        </div>
        {range.map(c => (
          <div
            key={`head-col-${c}`}
            className={`flex items-center justify-center font-bold text-slate-600 rounded text-sm ${activeCol === c ? 'bg-blue-200 text-blue-800' : 'bg-slate-100'}`}
          >
            {c}
          </div>
        ))}

        {/* Rows */}
        {range.map(r => (
          <React.Fragment key={`row-${r}`}>
            {/* Row Header */}
            <div
              className={`flex items-center justify-center font-bold text-slate-600 rounded text-sm h-8 w-8 ${activeRow === r ? 'bg-blue-200 text-blue-800' : 'bg-slate-100'}`}
            >
              {r}
            </div>

            {/* Cells */}
            {range.map(c => {
              const { val, isCompromised } = getCellData(r, c);

              const isResult = activeRow === r && activeCol === c;
              const isActiveRow = activeRow === r;
              const isActiveCol = activeCol === c;
              const isHighlight = highlightNumber !== null && highlightNumber !== undefined && val === highlightNumber;

              let bgClass = "bg-white";
              let textClass = "text-slate-800";

              if (isCompromised) {
                bgClass = "bg-red-100";
                textClass = "text-red-600 font-bold";
              }
              else if (isResult) {
                bgClass = "bg-blue-600 ring-2 ring-blue-300 z-10 scale-110 shadow-md";
                textClass = "text-white font-bold";
              }
              else if (isActiveRow || isActiveCol) {
                bgClass = "bg-blue-50";
              }
              else if (isHighlight) {
                bgClass = "bg-green-100";
                textClass = "text-green-700 font-semibold";
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={`flex items-center justify-center border border-slate-100 rounded text-sm h-8 transition-colors ${bgClass} ${textClass}`}
                  title={`${r} ${operation} ${c} = ${val}`}
                >
                  {val}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};