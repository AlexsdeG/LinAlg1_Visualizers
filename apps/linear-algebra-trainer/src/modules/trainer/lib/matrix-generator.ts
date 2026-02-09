import Fraction from 'fraction.js';
import { Matrix, MatrixRow, RowOperation, RowOperationType } from '../types';

/**
 * Generates an Identity Matrix of size n.
 */
export const generateIdentity = (size: number): Matrix => {
  const matrix: Matrix = [];
  for (let i = 0; i < size; i++) {
    const row: MatrixRow = [];
    for (let j = 0; j < size; j++) {
      row.push(new Fraction(i === j ? 1 : 0));
    }
    matrix.push(row);
  }
  return matrix;
};

/**
 * Applies a single Row Operation to a matrix.
 * Returns a NEW matrix (immutable).
 */
export const applyRowOp = (matrix: Matrix, op: RowOperation): Matrix => {
  // Deep copy the matrix to avoid mutation
  const newMatrix = matrix.map(row => row.map(val => val.clone()));
  const numRows = newMatrix.length;

  try {
    switch (op.type) {
      case RowOperationType.SWAP: {
        if (op.row1 < 0 || op.row1 >= numRows || op.row2 < 0 || op.row2 >= numRows) {
          throw new Error('Row index out of bounds');
        }
        const temp = newMatrix[op.row1];
        newMatrix[op.row1] = newMatrix[op.row2];
        newMatrix[op.row2] = temp;
        break;
      }

      case RowOperationType.SCALE: {
        if (op.row < 0 || op.row >= numRows) {
          throw new Error('Row index out of bounds');
        }
        if (op.factor.equals(0)) {
           throw new Error('Cannot scale by zero');
        }
        newMatrix[op.row] = newMatrix[op.row].map(val => val.mul(op.factor));
        break;
      }

      case RowOperationType.ADD: {
        if (op.sourceRow < 0 || op.sourceRow >= numRows || op.targetRow < 0 || op.targetRow >= numRows) {
          throw new Error('Row index out of bounds');
        }
        if (op.sourceRow === op.targetRow) {
           throw new Error('Cannot add row to itself (use Scale)');
        }
        const sourceRow = newMatrix[op.sourceRow];
        newMatrix[op.targetRow] = newMatrix[op.targetRow].map((val, colIndex) => {
          const addition = sourceRow[colIndex].mul(op.factor);
          return val.add(addition);
        });
        break;
      }
    }
  } catch (error) {
    console.error("Failed to apply row operation", error);
    return matrix; // Return original on error to prevent crash
  }

  return newMatrix;
};

/**
 * Generates a solvable system by starting with Identity and scrambling it
 * with valid row operations (inverse logic).
 * 
 * We use integer operations mostly to ensure "Nice Numbers".
 */
export const generateSolvableSystem = (size: number = 3, difficulty: number = 5): Matrix => {
  let matrix = generateIdentity(size);
  
  // Scramble the matrix
  for (let i = 0; i < difficulty; i++) {
    const r = Math.random();
    
    // 30% Swap
    if (r < 0.3) {
      const row1 = Math.floor(Math.random() * size);
      let row2 = Math.floor(Math.random() * size);
      while (row1 === row2) {
         row2 = Math.floor(Math.random() * size);
      }
      matrix = applyRowOp(matrix, { type: RowOperationType.SWAP, row1, row2 });
    } 
    // 50% Add Row (Add integer multiple of one row to another)
    else if (r < 0.8) {
      const source = Math.floor(Math.random() * size);
      let target = Math.floor(Math.random() * size);
      while (source === target) target = Math.floor(Math.random() * size);
      
      // Keep factors simple (-2, -1, 1, 2)
      const factorVal = Math.floor(Math.random() * 5) - 2 || 1; 
      matrix = applyRowOp(matrix, { 
        type: RowOperationType.ADD, 
        sourceRow: source, 
        targetRow: target, 
        factor: new Fraction(factorVal) 
      });
    }
    // 20% Scale Row (Only by small integers to keep things clean-ish)
    else {
      const row = Math.floor(Math.random() * size);
      const factorVal = Math.random() > 0.5 ? 2 : -1; // Keep it very simple for now
      matrix = applyRowOp(matrix, {
        type: RowOperationType.SCALE,
        row,
        factor: new Fraction(factorVal)
      });
    }
  }

  return matrix;
};

/**
 * Checks if a matrix is the Identity matrix.
 */
export const isIdentity = (matrix: Matrix): boolean => {
  for(let i=0; i<matrix.length; i++) {
    for(let j=0; j<matrix[i].length; j++) {
      const val = matrix[i][j];
      const target = i === j ? 1 : 0;
      if (!val.equals(target)) return false;
    }
  }
  return true;
};