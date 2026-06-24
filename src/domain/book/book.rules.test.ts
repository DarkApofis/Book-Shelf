import { describe, it, expect } from 'vitest';
import {
  bumpPage, clampPage, countByStatus, finishReading, fromCatalog,
  onShelf, pagesLeft, progressPct, setPage, startReading, DEFAULT_FINISH_RATING,
} from './book.rules';
import type { Book, CatalogBook } from './book.types';

const reading: Book = {
  id: 'b1', title: 'The Overstory', author: 'Richard Powers', genre: 'Fiction',
  pages: 500, rating: 0, status: 'reading', page: 200, cover: '#000', started: 'Jun 14',
};

describe('clampPage', () => {
  it('clamps below zero and above total', () => {
    expect(clampPage(-5, 500)).toBe(0);
    expect(clampPage(900, 500)).toBe(500);
    expect(clampPage(250, 500)).toBe(250);
  });
  it('treats NaN as zero', () => {
    expect(clampPage(Number.NaN, 500)).toBe(0);
  });
});

describe('progressPct', () => {
  it('rounds to a whole percent', () => {
    expect(progressPct(200, 500)).toBe(40);
    expect(progressPct(1, 3)).toBe(33);
  });
  it('is zero for a zero-page book', () => {
    expect(progressPct(0, 0)).toBe(0);
  });
});

describe('pagesLeft', () => {
  it('never goes negative', () => {
    expect(pagesLeft({ page: 520, pages: 500 })).toBe(0);
    expect(pagesLeft({ page: 200, pages: 500 })).toBe(300);
  });
});

describe('setPage / bumpPage', () => {
  it('setPage clamps to bounds', () => {
    expect(setPage(reading, 999)).toEqual({ page: 500 });
  });
  it('bumpPage adds a delta within bounds', () => {
    expect(bumpPage(reading, 50)).toEqual({ page: 250 });
    expect(bumpPage(reading, -1000)).toEqual({ page: 0 });
  });
});

describe('status transitions', () => {
  it('startReading resets progress and clears sessions', () => {
    expect(startReading('Jun 23')).toEqual({
      status: 'reading', page: 0, started: 'Jun 23', sessions: [],
    });
  });

  it('finishReading completes the book and keeps an existing rating', () => {
    const rated = finishReading({ ...reading, rating: 5 });
    expect(rated).toEqual({ status: 'finished', page: 500, rating: 5 });
  });

  it('finishReading applies a default rating when unrated', () => {
    expect(finishReading(reading).rating).toBe(DEFAULT_FINISH_RATING);
  });
});

describe('fromCatalog', () => {
  it('creates a want-to-read book with no progress', () => {
    const entry: CatalogBook = {
      id: 'c1', title: 'Trust', author: 'Hernan Diaz', genre: 'Fiction', pages: 416, cover: '#45597e',
    };
    expect(fromCatalog(entry)).toEqual({
      ...entry, rating: 0, status: 'want', page: 0, sessions: [],
    });
  });
});

describe('shelf helpers', () => {
  const books: Book[] = [
    reading,
    { ...reading, id: 'b2', status: 'want' },
    { ...reading, id: 'b3', status: 'finished' },
    { ...reading, id: 'b4', status: 'finished' },
  ];
  it('onShelf("all") returns everything', () => {
    expect(onShelf(books, 'all')).toHaveLength(4);
  });
  it('onShelf filters by status', () => {
    expect(onShelf(books, 'finished').map((b) => b.id)).toEqual(['b3', 'b4']);
  });
  it('countByStatus counts a status', () => {
    expect(countByStatus(books, 'finished')).toBe(2);
    expect(countByStatus(books, 'reading')).toBe(1);
  });
});
