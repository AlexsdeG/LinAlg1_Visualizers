import Fraction from 'fraction.js';

export type MatrixRow = Fraction[];
export type Matrix = MatrixRow[];

export enum RowOperationType {
  SWAP = 'SWAP',
  SCALE = 'SCALE',
  ADD = 'ADD'
}

export type RowOperation =
  | { type: RowOperationType.SWAP; row1: number; row2: number }
  | { type: RowOperationType.SCALE; row: number; factor: Fraction }
  | { type: RowOperationType.ADD; sourceRow: number; targetRow: number; factor: Fraction };

export interface GaussGameState {
  matrix: Matrix;
  history: Matrix[];
  historyPointer: number;
}