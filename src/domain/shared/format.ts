/** Pure formatting & calendar helpers shared across the domain. No styling. */
import type { BookStatus } from '../book/book.types';

export const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const MONTHS_SHORT = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const;

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/** Insert thousands separators: 7184 -> "7,184". */
export function formatThousands(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Star-prefixed rating, or an em dash when unrated. */
export function formatRating(rating: number): string {
  return rating > 0 ? `★ ${rating}` : '—';
}

/** Human label for a book status. */
export function statusLabel(status: BookStatus): string {
  switch (status) {
    case 'reading': return 'Reading';
    case 'want': return 'Want to read';
    case 'finished': return 'Finished';
  }
}

/** Truncate long titles for cramped cover spines. */
export function truncateTitle(title: string, max = 26): string {
  return title.length > max ? `${title.slice(0, max - 2)}…` : title;
}

/** Parse a "Jun 14"-style label into a Date in the given year. */
export function parseDateLabel(label: string, year: number): Date {
  const [month, day] = label.split(' ');
  return new Date(year, MONTH_INDEX[month] ?? 0, parseInt(day, 10));
}

/** Format a Date as a short "Jun 23" label. */
export function toDateLabel(date: Date): string {
  return `${MONTHS_FULL[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}
