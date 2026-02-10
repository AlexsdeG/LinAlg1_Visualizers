import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { generateTriangularSystem } from '../lib/matrix-generator';
import { Matrix } from '../types';
import Fraction from 'fraction.js';
import { FractionDisplay } from './FractionDisplay';

interface BackSubstitutionTrainerProps {
    size: number;
}

export const BackSubstitutionTrainer: React.FC<BackSubstitutionTrainerProps> = ({ size }) => {
    const { t } = useTranslation();
    const [system, setSystem] = useState<{ matrix: Matrix, solution: Fraction[] } | null>(null);
    const [inputs, setInputs] = useState<string[]>([]);
    const [results, setResults] = useState<(boolean | null)[]>([]); // null = not checked, true = correct, false = wrong
    const [isAllCorrect, setIsAllCorrect] = useState(false);

    useEffect(() => {
        generateNewProblem();
    }, [size]);

    const generateNewProblem = () => {
        const newSystem = generateTriangularSystem(size);
        setSystem(newSystem);
        setInputs(new Array(size).fill(''));
        setResults(new Array(size).fill(null));
        setIsAllCorrect(false);
    };

    const handleCheck = () => {
        if (!system) return;

        const newResults = inputs.map((input, index) => {
            try {
                if (!input.trim()) return null;
                const val = new Fraction(input);
                return val.equals(system.solution[index]);
            } catch (e) {
                return false;
            }
        });

        setResults(newResults);
        setIsAllCorrect(newResults.every(r => r === true));
    };

    if (!system) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Back Substitution Challenge</h3>
                <button
                    onClick={generateNewProblem}
                    className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded"
                >
                    New Problem
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* System of Equations */}
                <div className="bg-slate-50 p-6 rounded border border-slate-100 flex flex-col justify-center">
                    {system.matrix.map((row, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-lg mb-2">
                            {row.slice(0, -1).map((val, j) => {
                                if (val.equals(0)) return null;
                                const sign = val.s === -1 ? '-' : (j > i ? '+' : ''); // simple sign logic
                                // If it's the first non-zero element in row, don't show +
                                // Since it's triangular, first non-zero is at j==i usually.
                                const showSign = j > i || (j === i && val.s === -1);

                                return (
                                    <React.Fragment key={j}>
                                        {showSign && <span className="text-slate-400 mx-1">{val.s === -1 ? '-' : '+'}</span>}
                                        {!val.abs().equals(1) && <span>{val.abs().toFraction(true)}</span>}
                                        <span className="font-bold text-slate-700">x<sub>{j + 1}</sub></span>
                                    </React.Fragment>
                                );
                            })}
                            <span className="text-slate-400 mx-2">=</span>
                            <span className="font-bold">{row[row.length - 1].toFraction(true)}</span>
                        </div>
                    ))}
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-4 justify-center">
                    <p className="text-sm text-slate-500 mb-2">
                        Solve for the variables starting from the bottom equation.
                    </p>

                    {/* Render inputs in reverse order (bottom-up) as per back-sub logic? 
              User might prefer top-down visually. Let's do top-down standard. 
          */}
                    {inputs.map((val, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <label className="font-mono font-bold w-8 text-right">x<sub>{i + 1}</sub> =</label>
                            <input
                                type="text"
                                value={val}
                                onChange={e => {
                                    const newInputs = [...inputs];
                                    newInputs[i] = e.target.value;
                                    setInputs(newInputs);
                                    // Reset result status for this field
                                    const newResults = [...results];
                                    newResults[i] = null;
                                    setResults(newResults);
                                }}
                                className={`p-2 border rounded w-full max-w-[120px] font-mono ${results[i] === true ? 'border-green-500 bg-green-50 ring-2 ring-green-200' :
                                        results[i] === false ? 'border-red-500 bg-red-50 ring-2 ring-red-200' :
                                            'border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                    }`}
                                placeholder="?"
                            />
                            {results[i] === true && <span className="text-green-600 text-sm">Correct</span>}
                            {results[i] === false && <span className="text-red-600 text-sm">Check calc</span>}
                        </div>
                    ))}

                    <button
                        onClick={handleCheck}
                        disabled={isAllCorrect}
                        className={`mt-4 w-full py-2 rounded font-bold transition-colors ${isAllCorrect
                                ? 'bg-green-600 text-white cursor-default'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isAllCorrect ? 'All Correct! 🎉' : 'Check Answers'}
                    </button>
                </div>
            </div>
        </div>
    );
};
