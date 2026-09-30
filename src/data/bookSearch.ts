/**
 * Frontend client for the BFF book-search endpoint. Maps the BFF's source-agnostic
 * results into the `CatalogBook` shape the Discover UI and the library store expect,
 * assigning a stable typographic-cover color for books whose image is missing.
 */
import type { CatalogBook } from '../domain/book/book.types';

/** The search API response item — mirrors src/server/types.ts `BookSearchResult`
 *  (kept local so the client bundle never imports server code). */
interface SearchResultDTO {
  sourceId: string;
  title: string;
  author: string;
  coverUrl: string | null;
  pages: number | null;
  firstPublishYear: number | null;
  isbn: string | null;
  genre: string | null;
}

/** The same palette the seed catalog uses, so search covers feel native. */
const COVER_COLORS = [
  '#4f7a6a', '#45597e', '#9a6849', '#356a68',
  '#5a6a4d', '#2a2c33', '#5b4a66', '#33444b',
];

/** Deterministic color from the source id, so a book's fallback cover is stable. */
function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

function toCatalogBook(r: SearchResultDTO): CatalogBook {
  return {
    id: r.sourceId,
    sourceId: r.sourceId,
    title: r.title,
    author: r.author,
    genre: r.genre ?? 'General',
    pages: r.pages ?? 0,
    cover: pickColor(r.sourceId),
    coverUrl: r.coverUrl,
    year: r.firstPublishYear,
  };
}

/** Search books via the same-origin /api/search route. Throws on network/HTTP
 *  error (caller surfaces it). */
export async function searchBooks(query: string, signal?: AbortSignal): Promise<CatalogBook[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data = (await res.json()) as { results: SearchResultDTO[] };
  return data.results.map(toCatalogBook);
}
