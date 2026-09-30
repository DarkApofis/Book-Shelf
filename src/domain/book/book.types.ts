/** Core book domain types. Framework-free — no React, no Next, no UI concerns. */

export type BookStatus = 'reading' | 'want' | 'finished';

/** The shelves a user can filter by. `all` is a view filter, not a book status. */
export type ShelfTab = 'all' | BookStatus;

export interface ReadingSession {
  date: string;
  pages: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  rating: number;
  status: BookStatus;
  /** Current page the reader has reached (0..pages). */
  page: number;
  /** Solid cover color — the typographic fallback shown when there's no image. */
  cover: string;
  /** Real cover image URL from the source API, when available. */
  coverUrl?: string | null;
  /** Stable source-API work id (e.g. Open Library "/works/OL…W"). For de-dupe. */
  sourceId?: string | null;
  /** Human label for the day reading began, e.g. "Jun 14". Set when started. */
  started?: string;
  sessions?: ReadingSession[];
}

/** A book in the Discover catalog — not yet on any shelf, so no reading state. */
export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  cover: string;
  coverUrl?: string | null;
  sourceId?: string | null;
  /** First publication year from the source API, when known. */
  year?: number | null;
}
