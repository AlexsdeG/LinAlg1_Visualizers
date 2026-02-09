import Fraction from 'fraction.js';

/**
 * Safely converts string or number to a Fraction object.
 * Handles edge cases and ensures valid Fraction return.
 */
export const toFraction = (input: string | number | Fraction): Fraction => {
  try {
    return new Fraction(input);
  } catch (error) {
    console.error(`Invalid fraction input: ${input}`, error);
    return new Fraction(0);
  }
};

/**
 * Formats a Fraction for UI display.
 * Returns simple string "n/d" or "n" if integer.
 * Used for input values or simple text displays.
 */
export const formatFraction = (f: Fraction): string => {
  return f.toFraction(); // Returns improper fractions (e.g. 3/2) instead of mixed (1 1/2)
};

/**
 * Formats a Fraction for LaTeX rendering (KaTeX).
 */
export const toLatex = (f: Fraction): string => {
  if (f.d === 1n) {
    return `${f.s * f.n}`;
  }
  const sign = f.s === -1n ? '-' : '';
  return `${sign}\\frac{${f.n}}{${f.d}}`;
};

/**
 * Validates if a string is a valid fraction input.
 */
export const isValidFraction = (input: string): boolean => {
  try {
    new Fraction(input);
    return true;
  } catch (e) {
    return false;
  }
};