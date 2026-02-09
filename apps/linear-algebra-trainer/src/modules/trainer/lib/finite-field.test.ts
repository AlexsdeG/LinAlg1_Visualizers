import { describe, it, expect } from 'vitest';
import { safeMod, extendedGCD, modInverse, modAdd, modSub, modMul, modDivDetails } from './finite-field';

describe('finite-field utils', () => {
  it('safeMod handles negative numbers correctly', () => {
    expect(safeMod(-1, 5)).toBe(4);
    expect(safeMod(-5, 5)).toBe(0);
    expect(safeMod(7, 5)).toBe(2);
  });

  it('extendedGCD finds coefficients', () => {
    // 3*x + 7*y = 1 -> 3*(-2) + 7*(1) = -6 + 7 = 1. x = -2, y = 1 (or similar)
    const { gcd, x, y } = extendedGCD(3, 7);
    expect(gcd).toBe(1);
    expect(3 * x + 7 * y).toBe(1);
  });

  it('modInverse finds correct inverse', () => {
    // 3 * 5 = 15 = 1 mod 7
    expect(modInverse(3, 7)).toBe(5);
    // 2 * 3 = 6 = 1 mod 5
    expect(modInverse(2, 5)).toBe(3);
  });

  it('modInverse returns null if no inverse', () => {
    // 2 in mod 4 (gcd is 2)
    expect(modInverse(2, 4)).toBe(null);
  });

  it('basic arithmetic operations work', () => {
    expect(modAdd(3, 4, 5)).toBe(2); // 7 % 5
    expect(modSub(1, 4, 5)).toBe(2); // -3 % 5 -> 2
    expect(modMul(3, 3, 7)).toBe(2); // 9 % 7
  });

  it('modDivDetails provides steps and correct result', () => {
    // 3 / 4 mod 7
    // 4^-1 mod 7 is 2 (since 4*2=8=1)
    // 3 * 2 = 6
    const res = modDivDetails(3, 4, 7);
    expect(res.result).toBe(6);
    expect(res.steps.length).toBeGreaterThan(0);
    expect(res.error).toBeUndefined();
  });

  it('modDivDetails handles impossible division', () => {
    const res = modDivDetails(1, 2, 4);
    expect(res.result).toBeNull();
    expect(res.error).toBe('ff.error.noInverse');
  });
});