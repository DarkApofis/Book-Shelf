/**
 * Book business rules — pure functions that own every state transition and
 * invariant for a book. The store and UI call these; they never mutate book
 * state inline. This is where "what it means to start/finish/progress a book"
 * lives, independent of React.
 */
import type { Book, BookStatus, CatalogBook, ShelfTab } from './book.types';

/** Default rating applied when a book is finished without an explicit one. */
export const DEFAULT_FINISH_RATING = 4;

/** Clamp a page number into the valid [0, pages] range, guarding against NaN. */
export function clampPage(page: number, totalPages: number): number {
  if (Number.isNaN(page)) return 0;
  return Math.min(totalPages, Math.max(0, page));
}

/** Reading progress as a whole percentage (0..100). */
export function progressPct(page: number, totalPages: number): number {
  return totalPages ? Math.round((page / totalPages) * 100) : 0;
}

/** Pages still left to read. Never negative. */
export function pagesLeft(book: Pick<Book, 'page' | 'pages'>): number {
  return Math.max(0, book.pages - book.page);
}

/** Set an exact page, clamped to the book's bounds. Returns the patch. */
export function setPage(book: Book, page: number): Partial<Book> {
  return { page: clampPage(page, book.pages) };
}

/** Advance the page by a delta (positive or negative), clamped. Returns the patch. */
export function bumpPage(book: Book, delta: number): Partial<Book> {
  return { page: clampPage((book.page || 0) + delta, book.pages) };
}

/** Transition a book to "reading", resetting progress to page zero. */
export function startReading(startedLabel: string): Partial<Book> {
  return { status: 'reading', page: 0, started: startedLabel, sessions: [] };
}

/** Transition a book to "finished": full progress and a guaranteed rating. */
export function finishReading(book: Book): Partial<Book> {
  return {
    status: 'finished',
    page: book.pages,
    rating: book.rating || DEFAULT_FINISH_RATING,
  };
}

/** Promote a catalog entry into a shelf book in the "want to read" state. */
export function fromCatalog(catalogBook: CatalogBook): Book {
  return {
    ...catalogBook,
    rating: 0,
    status: 'want',
    page: 0,
    sessions: [],
  };
}

/** Filter a list to a shelf tab (`all` returns everything). */
export function onShelf(books: Book[], shelf: ShelfTab): Book[] {
  return shelf === 'all' ? books : books.filter((b) => b.status === shelf);
}

/** Count of books currently in a given status. */
export function countByStatus(books: Book[], status: BookStatus): number {
  return books.filter((b) => b.status === status).length;
}
