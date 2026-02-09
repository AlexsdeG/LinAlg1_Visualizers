import { describe, it, expect } from 'vitest';
import Fraction from 'fraction.js';
import { toFraction, formatFraction, toLatex, isValidFraction } from './fraction-utils';

describe('fraction-utils', () => {
  it('toFraction converts strings correctly', () => {
    const f = toFraction('0.5');
    expect(f.equals(new Fraction(1, 2))).toBe(true);
  });

  it('toFraction handles division strings', () => {
    const f = toFraction('1/3');
    expect(f.equals(new Fraction(1, 3))).toBe(true);
  });

  it('formatFraction returns simple string representation', () => {
    const f = new Fraction(3, 2);
    expect(formatFraction(f)).toBe('3/2');
    const f2 = new Fraction(4, 2);
    expect(formatFraction(f2)).toBe('2');
  });

  it('toLatex returns LaTeX formatted string', () => {
    const f = new Fraction(3, 4);
    expect(toLatex(f)).toBe('\\frac{3}{4}');
    
    const f2 = new Fraction(-1, 2);
    expect(toLatex(f2)).toBe('-\\frac{1}{2}');
    
    const f3 = new Fraction(5);
    expect(toLatex(f3)).toBe('5');
  });

  it('isValidFraction validates inputs', () => {
    expect(isValidFraction('1/2')).toBe(true);
    expect(isValidFraction('0.5')).toBe(true);
    expect(isValidFraction('abc')).toBe(false);
  });
});