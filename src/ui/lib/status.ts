/** Maps a book status to its pill tone (token-backed Tailwind classes). */
import type { BookStatus } from '../../domain/book/book.types';

export const STATUS_PILL_CLASS: Record<BookStatus, string> = {
  reading: 'bg-reading-soft text-reading',
  want: 'bg-want-soft text-want',
  finished: 'bg-finished-soft text-finished',
};
