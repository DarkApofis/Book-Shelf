/**
 * Open Library client. Searches works, normalizes the messy upstream shape into
 * `BookSearchResult`, caches by query, and throttles to ~1 req/sec. All Open
 * Library quirks (missing fields, multi-edition noise) are absorbed here so the
 * rest of the app sees clean data. Server-only — imported by the /api/search
 * route handler, never by client code.
 */
import { TtlCache } from './cache';
import { createThrottle } from './throttle';
import type { BookSearchResult } from './types';

const SEARCH_URL = 'https://openlibrary.org/search.json';
// Request only the fields we use — smaller, faster responses.
const FIELDS = [
  'key',
  'title',
  'author_name',
  'cover_i',
  'first_publish_year',
  'isbn',
  'number_of_pages_median',
  'subject',
].join(',');

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
// Open Library's search.json is slow (often several seconds). Bound each attempt
// so a single hung call plus one retry still finishes inside the function's
// 30s budget rather than timing out the whole request.
const REQUEST_TIMEOUT_MS = 10000;
const RETRY_ATTEMPTS = 2;
const MIN_REQUEST_INTERVAL_MS = 1000; // Open Library: ~1 req/sec sustained

const cache = new TtlCache<BookSearchResult[]>(CACHE_TTL_MS);
const throttle = createThrottle(MIN_REQUEST_INTERVAL_MS);

interface OpenLibraryDoc {
  key: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  isbn?: string[];
  number_of_pages_median?: number;
  subject?: string[];
}

function coverUrl(coverId: number | undefined): string | null {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
}

function normalize(doc: OpenLibraryDoc): BookSearchResult {
  return {
    sourceId: doc.key,
    title: doc.title?.trim() || 'Untitled',
    author: doc.author_name?.[0]?.trim() || 'Unknown author',
    coverUrl: coverUrl(doc.cover_i),
    pages: doc.number_of_pages_median ?? null,
    firstPublishYear: doc.first_publish_year ?? null,
    isbn: doc.isbn?.[0] ?? null,
    genre: doc.subject?.[0] ?? null,
  };
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Folio/0.1 (Frontend Mentor Bookshelf challenge)' },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Retry transient failures (Open Library is slow and resets connections under load). */
async function withRetry<T>(task: () => Promise<T>, attempts: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await task();
    } catch (err) {
      lastError = err;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/** Search Open Library by free text (title / author / ISBN). Cached + throttled. */
export async function searchBooks(query: string, limit = 20): Promise<BookSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const cacheKey = `${q.toLowerCase()}::${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${SEARCH_URL}?q=${encodeURIComponent(q)}&fields=${FIELDS}&limit=${limit}`;
  const results = await throttle(() =>
    withRetry(async () => {
      const res = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS);
      if (!res.ok) throw new Error(`Open Library responded ${res.status}`);
      const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
      return (data.docs ?? []).map(normalize);
    }, RETRY_ATTEMPTS),
  );

  cache.set(cacheKey, results);
  return results;
}
