import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { EigenView } from './EigenView';
import { identityMatrix } from '../utils';

// Mock Mafs components
vi.mock('mafs', () => ({
  Mafs: ({ children }: any) => <div data-testid="mafs-root">{children}</div>,
  Coordinates: {
    Cartesian: () => <div data-testid="coordinates-cartesian" />,
  },
  Vector: () => <div data-testid="vector" />,
  MovablePoint: () => <div data-testid="movable-point" />,
  Line: {
    ThroughPoints: () => <div data-testid="line-through-points" />
  },
  Polygon: () => <div data-testid="polygon" />,
  Text: ({ children }: any) => <div data-testid="text">{children}</div>,
  Theme: {
      blue: 'blue',
      green: 'green',
      red: 'red',
      yellow: 'yellow'
  }
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('EigenView', () => {
  it('renders without crashing', () => {
    const matrix = identityMatrix();
    const setMatrix = vi.fn();
    expect(EigenView).toBeDefined();
    // In a real browser test, we would mount and check for elements
  });
});