import { describe, it, expect } from 'vitest';
import Fraction from 'fraction.js';
import { generateIdentity, applyRowOp, isIdentity, generateSolvableSystem } from './matrix-generator';
import { RowOperationType } from '../types';

describe('matrix-generator', () => {
  it('generateIdentity creates correct identity matrix', () => {
    const id3 = generateIdentity(3);
    expect(id3.length).toBe(3);
    expect(id3[0][0].equals(1)).toBe(true);
    expect(id3[0][1].equals(0)).toBe(true);
    expect(id3[2][2].equals(1)).toBe(true);
  });

  it('applyRowOp: SWAP works correctly', () => {
    const matrix = generateIdentity(3);
    // [1, 0, 0]
    // [0, 1, 0]
    // [0, 0, 1]
    
    const newMatrix = applyRowOp(matrix, { type: RowOperationType.SWAP, row1: 0, row2: 1 });
    // Expected:
    // [0, 1, 0]
    // [1, 0, 0]
    // [0, 0, 1]

    expect(newMatrix[0][0].equals(0)).toBe(true);
    expect(newMatrix[0][1].equals(1)).toBe(true);
    expect(newMatrix[1][0].equals(1)).toBe(true);
    
    // Original should be immutable
    expect(matrix[0][0].equals(1)).toBe(true);
  });

  it('applyRowOp: SCALE works correctly', () => {
    const matrix = generateIdentity(3);
    const newMatrix = applyRowOp(matrix, { 
      type: RowOperationType.SCALE, 
      row: 0, 
      factor: new Fraction(2) 
    });
    
    expect(newMatrix[0][0].equals(2)).toBe(true);
    expect(newMatrix[1][1].equals(1)).toBe(true);
  });

  it('applyRowOp: ADD works correctly', () => {
    const matrix = generateIdentity(3);
    // Add 2 * Row 1 to Row 0
    // Row 0 = Row 0 + 2 * Row 1
    // [1, 0, 0] + 2*[0, 1, 0] = [1, 2, 0]
    
    const newMatrix = applyRowOp(matrix, {
      type: RowOperationType.ADD,
      sourceRow: 1,
      targetRow: 0,
      factor: new Fraction(2)
    });

    expect(newMatrix[0][0].equals(1)).toBe(true);
    expect(newMatrix[0][1].equals(2)).toBe(true);
    expect(newMatrix[1][1].equals(1)).toBe(true);
  });

  it('applyRowOp: ADD works with fractions', () => {
    const matrix = generateIdentity(3);
    // Add 1/2 * Row 1 to Row 0
    const newMatrix = applyRowOp(matrix, {
      type: RowOperationType.ADD,
      sourceRow: 1,
      targetRow: 0,
      factor: new Fraction(1, 2)
    });
    
    expect(newMatrix[0][1].equals(0.5)).toBe(true);
  });

  it('isIdentity checks correctly', () => {
    const id = generateIdentity(3);
    expect(isIdentity(id)).toBe(true);
    
    const notId = applyRowOp(id, { type: RowOperationType.SCALE, row: 0, factor: new Fraction(2) });
    expect(isIdentity(notId)).toBe(false);
  });

  it('generateSolvableSystem returns a matrix of correct size', () => {
    const sys = generateSolvableSystem(3, 10);
    expect(sys.length).toBe(3);
    expect(sys[0].length).toBe(3);
  });
  
  it('applyRowOp handles out of bounds gracefully (returns original)', () => {
    const matrix = generateIdentity(3);
    const newMatrix = applyRowOp(matrix, { type: RowOperationType.SCALE, row: 99, factor: new Fraction(2) });
    expect(newMatrix).toBe(matrix); // Or equal by value
  });
});