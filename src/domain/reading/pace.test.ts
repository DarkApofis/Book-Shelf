import { describe, it, expect } from 'vitest';
import { estimatePace } from './pace';
import type { Book } from '../book/book.types';

const TODAY = new Date(2026, 5, 23); // Jun 23, 2026

const reading: Book = {
  id: 'b1', title: 'The Overstory', author: 'Richard Powers', genre: 'Fiction',
  pages: 502, rating: 4.5, status: 'reading', page: 214, cover: '#4f7a6a', started: 'Jun 14',
};

describe('estimatePace', () => {
  it('projects pace and finish for an in-progress book', () => {
    const est = estimatePace(reading, TODAY);
    expect(est).not.toBeNull();
    expect(est).toEqual({ daysIn: 9, pace: 24, daysLeft: 12, estFinish: 'Jul 5' });
  });

  it('returns null when the book is not being read', () => {
    expect(estimatePace({ ...reading, status: 'finished' }, TODAY)).toBeNull();
  });

  it('returns null when there is no start date', () => {
    expect(estimatePace({ ...reading, started: undefined }, TODAY)).toBeNull();
  });

  it('never reports a pace below one page per day', () => {
    const barelyStarted: Book = { ...reading, page: 1, started: 'Jan 1' };
    expect(estimatePace(barelyStarted, TODAY)?.pace).toBeGreaterThanOrEqual(1);
  });
});
