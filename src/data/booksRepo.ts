/**
 * Supabase persistence for the reader's library. Translates between database
 * rows (real `date` columns, per-user via RLS) and the framework-free `Book`
 * domain type the app renders (short "Jun 14" labels). Member mode only — guest
 * sessions never reach this layer.
 */
import { supabase } from '../lib/supabaseClient';
import type { Book, BookStatus, ReadingSession } from '../domain/book/book.types';
import { parseDateLabel, toDateLabel } from '../domain/shared/format';
import { APP_TODAY } from '../config/app';

/** Labels carry no year; anchor them to the app's simulated current year. */
const YEAR = APP_TODAY.getFullYear();

interface BookRow {
  id: string;
  title: string;
  author: string;
  genre: string;
  pages: number;
  rating: number | string;
  status: BookStatus;
  page: number;
  cover: string;
  cover_url: string | null;
  source_id: string | null;
  started_on: string | null;
}

interface SessionRow {
  book_id: string;
  read_on: string;
  pages: number;
}

function client() {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase;
}

/** "Jun 14" label -> "2026-06-14" date string for a date column. */
function labelToISO(label: string): string {
  return toISO(parseDateLabel(label, YEAR));
}

/** "2026-06-14" date column -> "Jun 14" label (parsed as local, no TZ shift). */
function isoToLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return toDateLabel(new Date(y, m - 1, d));
}

function toISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function rowToBook(row: BookRow, sessions: ReadingSession[]): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    pages: row.pages,
    rating: Number(row.rating),
    status: row.status,
    page: row.page,
    cover: row.cover,
    coverUrl: row.cover_url,
    sourceId: row.source_id,
    ...(row.started_on ? { started: isoToLabel(row.started_on) } : {}),
    ...(sessions.length ? { sessions } : {}),
  };
}

/** Map a `Book` patch to a writable column subset (skips undefined fields). */
function bookPatchToRow(patch: Partial<Book>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.page !== undefined) row.page = patch.page;
  if (patch.rating !== undefined) row.rating = patch.rating;
  if (patch.started !== undefined) row.started_on = patch.started ? labelToISO(patch.started) : null;
  return row;
}

export const booksRepo = {
  /** Load the signed-in reader's full library (RLS scopes rows to them). */
  async fetchLibrary(): Promise<Book[]> {
    const db = client();
    const [{ data: books, error: bErr }, { data: sessions, error: sErr }] = await Promise.all([
      db.from('books').select('*').order('created_at', { ascending: true }),
      db.from('reading_sessions').select('book_id, read_on, pages').order('read_on', { ascending: false }),
    ]);
    if (bErr) throw bErr;
    if (sErr) throw sErr;

    const byBook = new Map<string, ReadingSession[]>();
    for (const s of (sessions ?? []) as SessionRow[]) {
      const list = byBook.get(s.book_id) ?? [];
      list.push({ date: isoToLabel(s.read_on), pages: s.pages });
      byBook.set(s.book_id, list);
    }
    return ((books ?? []) as BookRow[]).map((row) => rowToBook(row, byBook.get(row.id) ?? []));
  },

  /** Insert a new shelf book. `book.id` is a client-generated uuid. */
  async insertBook(book: Book, userId: string): Promise<void> {
    const { error } = await client().from('books').insert({
      id: book.id,
      user_id: userId,
      title: book.title,
      author: book.author,
      genre: book.genre,
      pages: book.pages,
      rating: book.rating,
      status: book.status,
      page: book.page,
      cover: book.cover,
      cover_url: book.coverUrl ?? null,
      source_id: book.sourceId ?? null,
      started_on: book.started ? labelToISO(book.started) : null,
    });
    if (error) throw error;
  },

  /** Persist a partial book change (page, status, rating, started). */
  async updateBook(id: string, patch: Partial<Book>): Promise<void> {
    const row = bookPatchToRow(patch);
    if (Object.keys(row).length === 0) return;
    const { error } = await client().from('books').update(row).eq('id', id);
    if (error) throw error;
  },

  /** Clear logged sessions for a book (used when (re)starting it). */
  async clearSessions(bookId: string): Promise<void> {
    const { error } = await client().from('reading_sessions').delete().eq('book_id', bookId);
    if (error) throw error;
  },
};
