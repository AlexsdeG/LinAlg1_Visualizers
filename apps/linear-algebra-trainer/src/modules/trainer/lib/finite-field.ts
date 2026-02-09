/**
 * Ensures the result is always a positive number between 0 and m-1.
 * Javascript's % operator returns negative values for negative inputs.
 */
export const safeMod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

/**
 * Extended Euclidean Algorithm
 * Returns { gcd, x, y } such that ax + by = gcd(a, b)
 */
export const extendedGCD = (a: number, b: number): { gcd: number; x: number; y: number } => {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }
  const { gcd, x, y } = extendedGCD(b, a % b);
  return { gcd, x: y, y: x - Math.floor(a / b) * y };
};

/**
 * Finds the modular multiplicative inverse of a under modulo m.
 * Returns null if the inverse does not exist (gcd(a, m) != 1).
 */
export const modInverse = (a: number, m: number): number | null => {
  const { gcd, x } = extendedGCD(a, m);
  if (gcd !== 1) return null;
  return safeMod(x, m);
};

export const modAdd = (a: number, b: number, m: number): number => safeMod(a + b, m);
export const modSub = (a: number, b: number, m: number): number => safeMod(a - b, m);
export const modMul = (a: number, b: number, m: number): number => safeMod(a * b, m);

/**
 * Modular division a / b (mod m).
 * Returns { result: number, steps: string[] } or throws error if invalid.
 */
export const modDivDetails = (a: number, b: number, m: number): { result: number | null; steps: string[]; error?: string } => {
  const steps: string[] = [];
  
  if (b === 0) {
    return { result: null, steps, error: 'ff.error.divZero' };
  }

  // 1. Find Inverse of b
  const inv = modInverse(b, m);
  
  if (inv === null) {
    const { gcd } = extendedGCD(b, m);
    steps.push(`GCD(${b}, ${m}) = ${gcd} ≠ 1`);
    return { result: null, steps, error: 'ff.error.noInverse' };
  }

  steps.push(`Inverse: ${b}⁻¹ mod ${m} = ${inv}`);
  steps.push(`Check: ${b} ⋅ ${inv} = ${b * inv} ≡ ${(b * inv) % m} mod ${m}`);
  
  // 2. Multiply a * inv
  const result = modMul(a, inv, m);
  steps.push(`Calculation: ${a} ⋅ ${inv} (inverse of ${b})`);
  steps.push(`${a * inv} mod ${m} = ${result}`);

  return { result, steps };
};

/**
 * Checks if number is Prime.
 * Simple implementation sufficient for small inputs used in this app (<100).
 */
export const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};