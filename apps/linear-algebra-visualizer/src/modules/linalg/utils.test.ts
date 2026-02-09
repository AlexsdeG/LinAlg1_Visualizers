import { describe, it, expect } from 'vitest';
import { getDeterminant, inverse2x2, applyMatrix, matrixToCss, identityMatrix, getEigenSystem } from './utils';

describe('Linear Algebra Utils', () => {
  describe('getDeterminant', () => {
    it('should calculate determinant of identity matrix', () => {
      const id = identityMatrix();
      expect(getDeterminant(id)).toBe(1);
    });

    it('should calculate determinant of a scaling matrix', () => {
      const scale = { ix: 2, iy: 0, jx: 0, jy: 3 };
      expect(getDeterminant(scale)).toBe(6);
    });

    it('should calculate negative determinant (flip)', () => {
      const flip = { ix: -1, iy: 0, jx: 0, jy: 1 };
      expect(getDeterminant(flip)).toBe(-1);
    });
  });

  describe('inverse2x2', () => {
    it('should invert identity matrix', () => {
      const id = identityMatrix();
      const inv = inverse2x2(id);
      expect(inv).toEqual(id);
    });

    it('should return null for singular matrix', () => {
      const singular = { ix: 1, iy: 1, jx: 2, jy: 2 }; // Rows are linearly dependent
      expect(inverse2x2(singular)).toBeNull();
    });

    it('should correctly invert a basic matrix', () => {
      // A = [4 7]
      //     [2 6]
      // det = 24 - 14 = 10
      // inv = 1/10 * [6 -7]
      //              [-2 4]
      //     = [0.6 -0.7]
      //       [-0.2 0.4]
      const mat = { ix: 4, iy: 2, jx: 7, jy: 6 };
      const inv = inverse2x2(mat);
      
      expect(inv).not.toBeNull();
      if (inv) {
        expect(inv.ix).toBeCloseTo(0.6);
        expect(inv.jx).toBeCloseTo(-0.7);
        expect(inv.iy).toBeCloseTo(-0.2);
        expect(inv.jy).toBeCloseTo(0.4);
      }
    });
  });

  describe('applyMatrix', () => {
    it('should map i_hat to first column', () => {
      const mat = { ix: 2, iy: 3, jx: 4, jy: 5 };
      const i_hat = { x: 1, y: 0 };
      const res = applyMatrix(mat, i_hat);
      expect(res.x).toBe(2);
      expect(res.y).toBe(3);
    });
  });

  describe('matrixToCss', () => {
    it('should format correctly for CSS transform', () => {
      const mat = { ix: 1, iy: 2, jx: 3, jy: 4 };
      // matrix(a, b, c, d, tx, ty)
      // a=ix, b=iy, c=jx, d=jy
      expect(matrixToCss(mat)).toBe('matrix(1, 2, 3, 4, 0, 0)');
    });
  });

  describe('getEigenSystem', () => {
    it('should find eigenvalues for identity matrix', () => {
      const id = identityMatrix();
      const sys = getEigenSystem(id);
      expect(sys.eigenvalues).toContain(1);
      // Identity has everything as eigenvector, but implementation returns basis axes usually
    });

    it('should find eigenvalues for diagonal matrix', () => {
      const mat = { ix: 2, iy: 0, jx: 0, jy: 3 };
      const sys = getEigenSystem(mat);
      expect(sys.eigenvalues).toContain(2);
      expect(sys.eigenvalues).toContain(3);
    });

    it('should handle no real eigenvalues (rotation)', () => {
      // 90 deg rotation
      const rot = { ix: 0, iy: 1, jx: -1, jy: 0 };
      const sys = getEigenSystem(rot);
      expect(sys.eigenvalues.length).toBe(0);
    });

    it('should find eigenvectors for shear', () => {
      // Shear [1 1]
      //       [0 1]
      // Eigenvalues: 1, 1
      // Eigenvector: (1, 0)
      const shear = { ix: 1, iy: 0, jx: 1, jy: 1 };
      const sys = getEigenSystem(shear);
      expect(sys.eigenvalues[0]).toBeCloseTo(1);
      
      const v = sys.eigenvectors[0];
      // Expect proportional to (1,0)
      // v.y should be 0, v.x non-zero
      expect(Math.abs(v.y)).toBeCloseTo(0);
      expect(Math.abs(v.x)).toBeGreaterThan(0);
    });
  });
});
