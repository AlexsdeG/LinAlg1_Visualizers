/**
 * Represents a 2x2 Matrix.
 * Stored as column vectors to align with geometric intuition.
 * Matrix A = [ i_hat | j_hat ]
 * A = | ix jx |
 *     | iy jy |
 */
export interface Matrix2D {
  ix: number;
  iy: number;
  jx: number;
  jy: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

/**
 * Returns the identity matrix.
 */
export const identityMatrix = (): Matrix2D => ({
  ix: 1,
  iy: 0,
  jx: 0,
  jy: 1,
});

/**
 * Calculates the determinant of a 2x2 matrix.
 * det(A) = ad - bc = ix*jy - iy*jx
 */
export const getDeterminant = (m: Matrix2D): number => {
  return m.ix * m.jy - m.iy * m.jx;
};

/**
 * Calculates the inverse of a 2x2 matrix.
 * Returns null if the determinant is 0 (singular matrix).
 */
export const inverse2x2 = (m: Matrix2D): Matrix2D | null => {
  const det = getDeterminant(m);
  if (Math.abs(det) < 1e-10) {
    return null; // Singular
  }

  const invDet = 1 / det;
  return {
    ix: m.jy * invDet,
    iy: -m.iy * invDet,
    jx: -m.jx * invDet,
    jy: m.ix * invDet,
  };
};

/**
 * Applies a matrix transformation to a vector.
 * v' = Av
 */
export const applyMatrix = (m: Matrix2D, v: Vector2): Vector2 => {
  return {
    x: m.ix * v.x + m.jx * v.y,
    y: m.iy * v.x + m.jy * v.y,
  };
};

/**
 * Converts the matrix to a CSS transform string.
 * SVG Matrix format: matrix(a, b, c, d, tx, ty)
 * Mapping:
 * a = ix (scale X)
 * b = iy (skew Y)
 * c = jx (skew X)
 * d = jy (scale Y)
 */
export const matrixToCss = (m: Matrix2D): string => {
  return `matrix(${m.ix}, ${m.iy}, ${m.jx}, ${m.jy}, 0, 0)`;
};

export interface EigenSystem {
  eigenvalues: number[];
  eigenvectors: Vector2[];
}

/**
 * Calculates real eigenvalues and eigenvectors for a 2x2 matrix.
 */
export const getEigenSystem = (m: Matrix2D): EigenSystem => {
  const trace = m.ix + m.jy;
  const det = getDeterminant(m);
  const discrim = trace * trace - 4 * det;

  // No real eigenvalues
  if (discrim < -1e-10) {
    return { eigenvalues: [], eigenvectors: [] };
  }

  // Avoid precision issues for discrim close to 0
  const d = discrim < 0 ? 0 : Math.sqrt(discrim);
  
  const lambda1 = (trace + d) / 2;
  const lambda2 = (trace - d) / 2;
  
  // Helper to find eigenvector for a given lambda
  // (A - λI)v = 0
  const findEv = (lambda: number): Vector2 => {
    // Matrix M = A - λI
    // | ix-λ   jx   |
    // | iy     jy-λ |
    
    // We want vector (x, y) such that M(x,y) = 0.
    // Row 1: (ix-λ)x + jx*y = 0  => if jx!=0, y = -(ix-λ)/jx * x. Let x=jx, y=-(ix-λ) = λ-ix.
    // Row 2: iy*x + (jy-λ)y = 0  => if iy!=0, x = -(jy-λ)/iy * y. Let y=iy, x=-(jy-λ) = λ-jy.
    
    // Use the row with largest coefficients for numerical stability
    if (Math.abs(m.jx) > Math.abs(m.iy)) {
      return { x: m.jx, y: lambda - m.ix };
    } else if (Math.abs(m.iy) > 1e-6) {
      return { x: lambda - m.jy, y: m.iy };
    } else {
      // Matrix is diagonal (or close to it)
      // A = | ix 0 |
      //     | 0 jy |
      if (Math.abs(m.ix - lambda) < Math.abs(m.jy - lambda)) {
        return { x: 1, y: 0 };
      } else {
        return { x: 0, y: 1 };
      }
    }
  };

  const ev1 = findEv(lambda1);
  const ev2 = findEv(lambda2);

  // Filter out zero vectors if calculation failed (shouldn't happen for real ev)
  // and handle duplicate eigenvalues (d ~ 0)
  const result: EigenSystem = {
    eigenvalues: [lambda1],
    eigenvectors: [ev1]
  };

  // If distinct eigenvalues, add the second one
  if (d > 1e-6) {
    result.eigenvalues.push(lambda2);
    result.eigenvectors.push(ev2);
  } else {
    // Repeated eigenvalue. Check if the second eigenvector is independent.
    // If matrix is identity-like (scaling), any vector is eigenvector.
    // If shear, only 1 eigenvector line.
    // For visualization purposes, we usually just want to show the lines.
    // If they are collinear, we only show 1.
    const cross = ev1.x * ev2.y - ev1.y * ev2.x;
    if (Math.abs(cross) > 1e-6) {
       result.eigenvalues.push(lambda2);
       result.eigenvectors.push(ev2);
    }
  }

  return result;
};
