import { describe, it, expect } from 'vitest';
import { buildYir } from './yir.shape';
import { YIR_DATA } from '../../data/yir.seed';

describe('buildYir — completed year (2025)', () => {
  const yir = buildYir(YIR_DATA, 'you', 2025);

  it('passes through headline figures', () => {
    expect(yir.books).toBe(21);
    expect(yir.pagesStr).toBe('7,184');
    expect(yir.avgRating).toBe('4.3');
  });

  it('marks the year as complete', () => {
    expect(yir.inProgress).toBe(false);
    expect(yir.eyebrow).toBe('2025 · WRAPPED');
    expect(yir.projNote).toBeUndefined();
  });

  it('derives the busiest month and top genre', () => {
    expect(yir.topMonth).toBe('April'); // peak of 3 books at index 3
    expect(yir.topGenre).toBe('Fiction');
  });

  it('always produces 12 month bars and 6 records', () => {
    expect(yir.monthly).toHaveLength(12);
    expect(yir.records).toHaveLength(6);
  });

  it('computes genre percentages that fit the data', () => {
    const fiction = yir.genres.find((g) => g.name === 'Fiction');
    expect(fiction?.count).toBe(9);
    expect(fiction?.pct).toBeGreaterThan(0);
  });
});

describe('buildYir — in-progress year (2026)', () => {
  const yir = buildYir(YIR_DATA, 'you', 2026);

  it('pro-rates figures and flags in-progress', () => {
    expect(yir.inProgress).toBe(true);
    expect(yir.eyebrow).toBe('2026 · SO FAR');
    expect(yir.books).toBe(10); // first 6 months of [1,2,1,3,2,1]
    expect(yir.books).toBeLessThan(YIR_DATA.you.books);
  });

  it('includes a pace projection note', () => {
    expect(yir.projNote).toContain('On pace for');
  });

  it('respects a custom elapsed-months window', () => {
    const q1 = buildYir(YIR_DATA, 'you', 2026, { elapsedMonths: 3 });
    expect(q1.books).toBe(4); // [1,2,1]
  });

  it('drops genres that pro-rate to zero', () => {
    expect(yir.genres.every((g) => g.count > 0)).toBe(true);
  });
});
