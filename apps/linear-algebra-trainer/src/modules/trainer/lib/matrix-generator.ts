import Fraction from 'fraction.js';
import { Matrix, MatrixRow, RowOperation, RowOperationType } from '../types';

/**
 * Generates an Identity Matrix of size n.
 */
export const generateIdentity = (rows: number, cols: number): Matrix => {
  const matrix: Matrix = [];
  for (let i = 0; i < rows; i++) {
    const row: MatrixRow = [];
    for (let j = 0; j < cols; j++) {
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
/**
 * Generates a solvable system by starting with Identity | Solution and scrambling it.
 * Return an Augmented Matrix (N rows x N+1 cols).
 */
export const generateSolvableSystem = (size: number = 3, difficulty: number = 1): Matrix => {
  // Ensure size is within bounds
  const safeSize = Math.max(2, Math.min(5, size));

  // Start with Identity (safeSize x safeSize)
  // We will append the solution vector to make it safeSize x (safeSize + 1)
  let matrix = generateIdentity(safeSize, safeSize);

  // Generate random integer solution
  // For the trainer, we want the final state to be [I | x].
  // So we start with [I | x] and reverse-scramble it.
  for (let i = 0; i < safeSize; i++) {
    // Random solution value between -5 and 5
    const solVal = new Fraction(Math.floor(Math.random() * 11) - 5);
    matrix[i].push(solVal);
  }

  // Difficulty maps to number of scramble operations
  const numOps = Math.floor(safeSize * (1 + difficulty));

  for (let i = 0; i < numOps; i++) {
    const r = Math.random();

    // 30% Swap
    if (r < 0.3) {
      const row1 = Math.floor(Math.random() * safeSize);
      let row2 = Math.floor(Math.random() * safeSize);
      while (row1 === row2) {
        row2 = Math.floor(Math.random() * safeSize);
      }
      matrix = applyRowOp(matrix, { type: RowOperationType.SWAP, row1, row2 });
    }
    // 50% Add Row
    else if (r < 0.8) {
      const source = Math.floor(Math.random() * safeSize);
      let target = Math.floor(Math.random() * safeSize);
      while (source === target) target = Math.floor(Math.random() * safeSize);

      // Select factor based on difficulty
      let factorVal = 1;
      if (difficulty === 1) {
        factorVal = Math.random() > 0.5 ? 1 : -1;
      } else if (difficulty === 2) {
        factorVal = Math.floor(Math.random() * 5) - 2 || 1; // -2 to 2
      } else {
        factorVal = Math.floor(Math.random() * 7) - 3 || 1; // -3 to 3
      }

      matrix = applyRowOp(matrix, {
        type: RowOperationType.ADD,
        sourceRow: source,
        targetRow: target,
        factor: new Fraction(factorVal)
      });
    }
    // 20% Scale Row
    else {
      const row = Math.floor(Math.random() * safeSize);
      let factorVal = 1;

      // For level 1, rarely scale or scale by -1
      if (difficulty === 1) {
        factorVal = -1;
      } else {
        // Simple scalars like 2, -2, maybe 3
        factorVal = Math.random() > 0.5 ? 2 : -1;
        if (difficulty > 2 && Math.random() > 0.7) factorVal = 3;
      }

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
 * Checks if a matrix is in Reduced Row Echelon Form (RREF).
 * For a square matrix, this is equivalent to being the Identity matrix.
 * However, we keep it general if we support non-square later.
 */
/**
 * Checks if a matrix is in Reduced Row Echelon Form (RREF).
 * For the trainer, we only care that the Coefficient Matrix (left square) matches Identity.
 */
export const checkIsRREF = (matrix: Matrix): boolean => {
  if (matrix.length === 0) return false;

  // We only check the NxN part on the left for identity structure
  // This allows the last column (augmented part) to be anything (the solution)
  return isIdentity(matrix);
};

/**
 * Generates an Upper Triangular Matrix system (REF) for Back Substitution practice.
 * Ensures the system has a unique solution (integer solutions for simplicity).
 */
export const generateTriangularSystem = (size: number = 3): { matrix: Matrix, solution: Fraction[] } => {
  const safeSize = Math.max(2, Math.min(5, size));

  // 1. Generate random integer solution
  const solution: Fraction[] = [];
  for (let i = 0; i < safeSize; i++) {
    solution.push(new Fraction(Math.floor(Math.random() * 11) - 5)); // -5 to 5
  }

  // 2. Generate Upper Triangular Matrix A
  const matrix: Matrix = [];
  for (let r = 0; r < safeSize; r++) {
    const row: MatrixRow = [];
    let rowVal = new Fraction(0); // for calculating b (last column)

    for (let c = 0; c < safeSize; c++) {
      if (c < r) {
        row.push(new Fraction(0)); // Lower triangle is 0
      } else if (c === r) {
        // Diagonal cannot be 0 for unique solution
        let diag = 0;
        while (diag === 0) diag = Math.floor(Math.random() * 5) - 2; // -2, -1, 1, 2
        const val = new Fraction(diag);
        row.push(val);
        rowVal = rowVal.add(val.mul(solution[c]));
      } else {
        // Upper triangle random
        const val = new Fraction(Math.floor(Math.random() * 5) - 2);
        row.push(val);
        rowVal = rowVal.add(val.mul(solution[c]));
      }
    }
    // Add result vector element
    row.push(rowVal);
    matrix.push(row);
  }

  return { matrix, solution };
};


/**
 * Checks if a matrix is the Identity matrix (or contains it unique sub-block).
 * Modified to checking only the left square NxN block if cols > rows.
 */
export const isIdentity = (matrix: Matrix): boolean => {
  const rows = matrix.length;
  if (rows === 0) return false;

  // Only check the square part (0..rows-1)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (j >= matrix[i].length) return false;

      const val = matrix[i][j];
      const target = i === j ? 1 : 0;
      if (!val.equals(target)) return false;
    }
  }
  return true;
};