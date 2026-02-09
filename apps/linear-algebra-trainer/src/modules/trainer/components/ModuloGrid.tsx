import React from 'react';

interface ModuloGridProps {
  modulus: number;
  highlightNumber?: number | null; // e.g. highlighting where '1' is
  activeRow?: number | null; // for calculator interaction
  activeCol?: number | null; // for calculator interaction
}

export const ModuloGrid: React.FC<ModuloGridProps> = ({ modulus, highlightNumber, activeRow, activeCol }) => {
  // Safety cap to prevent browser crash
  if (modulus > 20) {
    return (
      <div className="p-4 border border-slate-200 rounded text-slate-500 italic bg-slate-50">
        Grid too large to display efficiently (&gt;20).
      </div>
    );
  }

  const range = Array.from({ length: modulus }, (_, i) => i);

  return (
    <div className="overflow-x-auto pb-2">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `auto repeat(${modulus}, minmax(30px, 1fr))` }}
      >
        {/* Header Row */}
        <div className="h-8 w-8"></div> {/* Corner */}
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
              const val = (r * c) % modulus;
              const isResult = activeRow === r && activeCol === c;
              const isActiveRow = activeRow === r;
              const isActiveCol = activeCol === c;
              const isHighlight = highlightNumber === val;

              let bgClass = "bg-white";
              if (isResult) bgClass = "bg-blue-600 text-white font-bold ring-2 ring-blue-300 z-10 scale-110 shadow-md";
              else if (isActiveRow || isActiveCol) bgClass = "bg-blue-50";
              else if (isHighlight) bgClass = "bg-green-100 text-green-700 font-semibold";

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={`flex items-center justify-center border border-slate-100 rounded text-sm h-8 transition-colors ${bgClass}`}
                  title={`${r} × ${c} ≡ ${val}`}
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