import { describe, it, expect } from 'vitest';
import { goalPace } from './goal';

const JUN_23 = new Date(2026, 5, 23);

describe('goalPace', () => {
  it('reports how far behind an even pace the reader is', () => {
    const pace = goalPace(9, 36, JUN_23);
    expect(pace.expected).toBe(17);
    expect(pace.delta).toBe(-8);
    expect(pace.standing).toBe('behind');
    expect(pace.remaining).toBe(27);
    expect(pace.perMonthNeeded).toBe(4.3);
  });

  it('matches the spec example: 24 books by July 1 means ~12 read', () => {
    expect(goalPace(12, 24, new Date(2026, 6, 1)).standing).toBe('on-track');
  });

  it('flags readers comfortably ahead', () => {
    expect(goalPace(22, 36, JUN_23).standing).toBe('ahead');
  });

  it('treats a met goal as complete with nothing left to read', () => {
    const pace = goalPace(36, 36, JUN_23);
    expect(pace.standing).toBe('complete');
    expect(pace.remaining).toBe(0);
    expect(pace.perMonthNeeded).toBe(0);
  });

  it('places the expected marker by share of the year elapsed', () => {
    expect(goalPace(0, 12, new Date(2026, 0, 1)).yearElapsed).toBeCloseTo(1 / 365);
    expect(goalPace(0, 12, new Date(2026, 11, 31)).yearElapsed).toBe(1);
  });
});
