/**
 * Normalized book search result returned by the search API. Deliberately flat
 * and source-agnostic: the frontend shouldn't know or care that it came from
 * Open Library. `sourceId` is the stable upstream id used to de-duplicate and
 * to fetch full details later.
 */
export interface BookSearchResult {
  /** Upstream work id, e.g. "/works/OL27448W" — stable across editions. */
  sourceId: string;
  title: string;
  author: string;
  /** Absolute cover image URL, or null when the source has no cover. */
  coverUrl: string | null;
  /** Median page count across editions, or null when unknown. */
  pages: number | null;
  firstPublishYear: number | null;
  /** First ISBN found (10 or 13), or null. */
  isbn: string | null;
  /** First/primary subject as a coarse genre, or null. */
  genre: string | null;
}
