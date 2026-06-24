/**
 * Reading-pace projection. Pure: the "current day" is injected, never read
 * from the clock here, so the calculation is deterministic and testable.
 */
import type { Book } from '../book/book.types';
import { pagesLeft } from '../book/book.rules';
import { parseDateLabel, toDateLabel } from '../shared/format';

const MS_PER_DAY = 86_400_000;

export interface PaceEstimate {
  /** Days since the reader started the book (at least 1). */
  daysIn: number;
  /** Average pages read per day (at least 1). */
  pace: number;
  /** Estimated days remaining at the current pace. */
  daysLeft: number;
  /** Short label for the projected finish date, e.g. "Jul 4". */
  estFinish: string;
}

/**
 * Estimate pace and finish date for an in-progress book.
 * Returns `null` when there isn't enough information (not reading / no start).
 */
export function estimatePace(book: Book, today: Date): PaceEstimate | null {
  if (book.status !== 'reading' || !book.started) return null;

  const start = parseDateLabel(book.started, today.getFullYear());
  const daysIn = Math.max(1, Math.round((today.getTime() - start.getTime()) / MS_PER_DAY));
  const pace = Math.max(1, Math.round(book.page / daysIn));
  const daysLeft = Math.ceil(pagesLeft(book) / pace);
  const estDate = new Date(today.getTime() + daysLeft * MS_PER_DAY);

  return { daysIn, pace, daysLeft, estFinish: toDateLabel(estDate) };
}
