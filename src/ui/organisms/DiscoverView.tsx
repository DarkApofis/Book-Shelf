'use client';

import { useMemo } from 'react';
import type { CatalogBook } from '../../domain/book/book.types';
import { CATALOG, RECOMMENDATION_IDS, TRENDING_IDS } from '../../data/catalog.seed';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useUiStore } from '../../store/useUiStore';
import { useBookshelf } from '../../store/useBookshelf';
import { useBookSearch } from '../lib/useBookSearch';
import { BookCover } from '../atoms/BookCover';
import { Icon } from '../atoms/Icon';
import { IconButton } from '../atoms/IconButton';
import { AddToShelfButton } from '../molecules/AddToShelfButton';
import { SearchField } from '../molecules/SearchField';

const TASTE_CHIPS = ['Literary fiction', 'Sci-Fi', 'Mystery', 'Memoir', 'Fantasy', 'History'];
const GENRES = ['Fiction', 'Sci-Fi', 'Fantasy', 'History', 'Memoir', 'Nonfiction'];

/** Shared column template so the header row and result rows line up on desktop. */
const ROW_COLUMNS = 'nav:grid-cols-[48px_minmax(0,1fr)_110px_80px_190px]';

function metaLine(b: CatalogBook): string | null {
  return [b.year ? String(b.year) : null, b.pages ? `${b.pages} pages` : null].filter(Boolean).join(' · ') || null;
}

function ResultRow({ book, added, onAdd }: { book: CatalogBook; added: boolean; onAdd: () => void }) {
  const meta = metaLine(book);
  return (
    <li className={`grid grid-cols-[56px_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-line py-4 nav:items-center ${ROW_COLUMNS}`}>
      <BookCover title={book.title} author={book.author} imageUrl={book.coverUrl} size="sm" className="row-span-2 w-full nav:row-span-1" />
      <div className="min-w-0">
        <div className="text-[15px] font-semibold leading-[1.35]">{book.title}</div>
        <div className="text-[13.5px] text-muted">{book.author}</div>
        {meta && <div className="mt-0.5 text-[12.5px] tabular-nums text-muted nav:hidden">{meta}</div>}
      </div>
      <div className="hidden text-[14px] tabular-nums text-ink-soft nav:block">{book.year ?? '—'}</div>
      <div className="hidden text-[14px] tabular-nums text-ink-soft nav:block">{book.pages || '—'}</div>
      <div className="col-start-2 nav:col-start-auto nav:justify-self-end">
        <AddToShelfButton title={book.title} added={added} onAdd={onAdd} />
      </div>
    </li>
  );
}

function SkeletonRow() {
  return (
    <li aria-hidden="true" className={`grid grid-cols-[56px_minmax(0,1fr)] gap-x-4 border-b border-line py-4 nav:items-center ${ROW_COLUMNS}`}>
      <div className="aspect-[2/3] w-full animate-pulse rounded-[3px] bg-line-soft" />
      <div className="flex flex-col gap-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-line-soft" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-line-soft" />
      </div>
    </li>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="m-0 font-display text-[17px] font-semibold tracking-[-0.01em]">{children}</h2>;
}

export function DiscoverView() {
  const addedIds = useLibraryStore((s) => s.addedIds);
  const books = useLibraryStore((s) => s.books);
  const query = useUiStore((s) => s.query);
  const setQuery = useUiStore((s) => s.setQuery);
  const onboardVisible = useUiStore((s) => s.onboardVisible);
  const dismissOnboard = useUiStore((s) => s.dismissOnboard);
  const { add } = useBookshelf();

  const hasQuery = query.trim().length > 0;
  // Live search via the BFF (Open Library); curated rows below stay seed-based.
  const { results: searchResults, loading: searching, error: searchError } = useBookSearch(query);

  // A book is "added" if it was added this session, or it's already in the library
  // (matched by source id — survives reloads when the in-session set is empty).
  const librarySourceIds = useMemo(
    () => new Set(books.map((b) => b.sourceId).filter(Boolean)),
    [books],
  );
  const isAdded = (b: CatalogBook) =>
    addedIds.includes(b.id) || (b.sourceId ? librarySourceIds.has(b.sourceId) : false);

  const noResults = hasQuery && !searching && !searchError && searchResults.length === 0;
  const recommendations = CATALOG.filter((c) => RECOMMENDATION_IDS.includes(c.id));
  const trending = CATALOG.filter((c) => TRENDING_IDS.includes(c.id));

  return (
    <div className="mx-auto max-w-[var(--library-max-width)] px-5 pb-10 nav:px-10">
      <div className="pb-5 pt-6">
        <h1 className="m-0 font-display text-[30px] font-bold leading-[1.15] tracking-[-0.025em]">Discover</h1>
        <p className="mb-0 mt-1.5 text-[14px] text-muted">Find books on Open Library and add them to your shelves.</p>
      </div>

      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <SearchField
          id="discover-search"
          label="Search books by title, author or ISBN"
          value={query}
          onChange={setQuery}
          placeholder="Title, author or ISBN"
        />
      </form>

      {/* Search results */}
      {hasQuery && (
        <section aria-labelledby="res-h" aria-busy={searching} className="mt-8">
          <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2.5">
            <SectionTitle><span id="res-h">Results</span></SectionTitle>
            <span className="text-[13px] tabular-nums text-muted" aria-live="polite">
              {searching
                ? 'Searching…'
                : searchError
                  ? 'Search unavailable'
                  : `${searchResults.length} ${searchResults.length === 1 ? 'match' : 'matches'} for “${query.trim()}”`}
            </span>
          </div>

          {!searching && searchResults.length > 0 && (
            <div aria-hidden="true" className={`hidden gap-x-4 border-b border-line py-2.5 text-[12.5px] text-muted nav:grid ${ROW_COLUMNS}`}>
              <span /><span>Title</span><span>First published</span><span>Pages</span><span />
            </div>
          )}

          {searchError && (
            <div className="flex flex-col items-center px-5 py-12 text-center text-muted">
              <Icon name="alert" size={28} />
              <p className="mb-0 mt-3 text-[15px]">Book search is temporarily unavailable. Please try again.</p>
            </div>
          )}
          {noResults && (
            <div className="px-5 py-12 text-center">
              <p className="m-0 text-[15px] font-semibold">No books found</p>
              <p className="mb-0 mt-1 text-[14px] text-muted">Try a different title or check the spelling.</p>
            </div>
          )}

          <ul aria-label="Search results" className="m-0 list-none p-0">
            {searching
              ? Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)
              : searchResults.map((b) => <ResultRow key={b.id} book={b} added={isAdded(b)} onAdd={() => add(b)} />)}
          </ul>
        </section>
      )}

      {/* Curated (no query) */}
      {!hasQuery && (
        <>
          {onboardVisible && (
            <div className="mt-6 max-w-[720px] rounded-[10px] border border-line bg-sidebar px-5 py-[18px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-[15px] font-semibold">New here? Start with a genre</p>
                  <p className="mb-0 mt-1 text-[14px] text-muted">Pick one and we&apos;ll search for books to seed your shelves.</p>
                </div>
                <IconButton label="Dismiss" variant="plain" onClick={dismissOnboard} className="-mr-2 -mt-2">
                  <Icon name="close" size={18} />
                </IconButton>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {TASTE_CHIPS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setQuery(g)}
                    className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-3.5 text-[13.5px] font-medium text-ink-soft hover:border-line-strong hover:text-ink"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          <section aria-labelledby="rec-h" className="mt-10">
            <div className="mb-4">
              <SectionTitle><span id="rec-h">Because you read Project Hail Mary</span></SectionTitle>
              <p className="mb-0 mt-1 text-[13.5px] text-muted">Thoughtful, character-driven stories like the ones you keep coming back to.</p>
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-4 gap-y-6 p-0 nav:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] nav:gap-x-6">
              {recommendations.map((b) => (
                <li key={b.id} className="flex min-w-0 flex-col gap-2.5">
                  <BookCover title={b.title} author={b.author} imageUrl={b.coverUrl} className="w-full" />
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-[13.5px] font-semibold leading-[1.35]">{b.title}</div>
                    <div className="truncate text-[12.5px] text-muted">{b.author}</div>
                  </div>
                  <AddToShelfButton title={b.title} added={isAdded(b)} onAdd={() => add(b)} className="w-full" />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="trend-h" className="mt-10">
            <div className="border-b border-line pb-2.5"><SectionTitle><span id="trend-h">Trending this week</span></SectionTitle></div>
            <ol className="m-0 list-none p-0">
              {trending.map((b, i) => (
                <li key={b.id} className="flex items-center gap-4 border-b border-line py-3.5">
                  <span className="w-5 flex-none text-right font-display text-[15px] font-semibold tabular-nums text-muted">{i + 1}</span>
                  <BookCover title={b.title} author={b.author} imageUrl={b.coverUrl} size="sm" className="w-9 flex-none" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14.5px] font-semibold">{b.title}</div>
                    <div className="truncate text-[13px] text-muted">{b.author} · {b.genre}</div>
                  </div>
                  <AddToShelfButton title={b.title} added={isAdded(b)} onAdd={() => add(b)} />
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="genre-h" className="mt-10">
            <div className="mb-3.5"><SectionTitle><span id="genre-h">Browse by genre</span></SectionTitle></div>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setQuery(name)}
                  className="h-10 cursor-pointer rounded-lg border border-line bg-surface px-4 text-[14px] font-medium text-ink hover:bg-sidebar"
                >
                  {name}
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
