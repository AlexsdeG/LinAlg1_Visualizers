import { useState, useEffect, useCallback } from 'react';
import { Matrix, RowOperation } from '../types';
import { generateSolvableSystem, applyRowOp, isIdentity } from '../lib/matrix-generator';

export const useGaussGame = (size: number = 3) => {
  // History stack
  const [history, setHistory] = useState<Matrix[]>([]);
  const [pointer, setPointer] = useState<number>(-1);

  // Initialize game
  const initGame = useCallback(() => {
    const m = generateSolvableSystem(size);
    setHistory([m]);
    setPointer(0);
  }, [size]);

  // Initial load
  useEffect(() => {
    if (history.length === 0) {
      initGame();
    }
  }, [history.length, initGame]);

  // Derived state
  const currentMatrix = pointer >= 0 && history[pointer] ? history[pointer] : [];
  const isSolved = currentMatrix.length > 0 && isIdentity(currentMatrix);
  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  // Actions
  const applyOp = (op: RowOperation) => {
    if (isSolved || currentMatrix.length === 0) return;

    const newMatrix = applyRowOp(currentMatrix, op);
    
    // Check if effective (simple check, normally we trust the user means to do it)
    // We add to history
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(newMatrix);
    
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  };

  const undo = () => {
    if (canUndo) setPointer(pointer - 1);
  };

  const redo = () => {
    if (canRedo) setPointer(pointer + 1);
  };

  const reset = () => {
    initGame();
  };

  return {
    matrix: currentMatrix,
    isSolved,
    applyOp,
    undo,
    redo,
    reset,
    canUndo,
    canRedo
  };
};