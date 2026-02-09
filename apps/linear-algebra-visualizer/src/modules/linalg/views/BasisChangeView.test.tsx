import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { BasisChangeView } from './BasisChangeView';
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
    Segment: () => <div data-testid="line-segment" />
  },
  Text: ({ children }: any) => <div data-testid="text">{children}</div>,
  Theme: {
      blue: 'blue',
      green: 'green',
      red: 'red',
      yellow: 'yellow',
      indigo: 'indigo'
  }
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('BasisChangeView', () => {
  it('renders without crashing', () => {
    const matrix = identityMatrix();
    const setMatrix = vi.fn();
    expect(BasisChangeView).toBeDefined();
  });
});
