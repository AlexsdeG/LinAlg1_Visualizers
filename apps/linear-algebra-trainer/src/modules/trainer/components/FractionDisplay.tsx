import React from 'react';
import Fraction from 'fraction.js';

interface FractionDisplayProps {
  value: Fraction;
  className?: string;
  highlight?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({ value, className = '', highlight = false }) => {
  // Defensive clone
  const f = new Fraction(value);
  
  // Styling
  const baseClass = `inline-flex items-center justify-center ${className}`;
  const textClass = highlight ? 'font-bold text-blue-700' : 'text-slate-800';

  // Integer case
  if (f.d === 1n) {
    return <span className={`${baseClass} ${textClass}`}>{(f.s * f.n).toString()}</span>;
  }

  // Fraction case
  return (
    <div className={`${baseClass} inline-flex flex-col align-middle text-sm mx-1`}>
      <span className={`border-b border-slate-800 px-1 leading-none pb-0.5 text-center w-full ${textClass}`}>
        {f.s === -1n ? '-' : ''}{f.n.toString()}
      </span>
      <span className={`leading-none pt-0.5 text-center w-full ${textClass}`}>
        {f.d.toString()}
      </span>
    </div>
  );
};