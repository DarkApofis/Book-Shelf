'use client';

import { useMemo } from 'react';
import type { CatalogBook } from '../../domain/book/book.types';
import { truncateTitle } from '../../domain/shared/format';
import { CATALOG, RECOMMENDATION_IDS, TRENDING_IDS } from '../../data/catalog.seed';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useUiStore } from '../../store/useUiStore';
import { useBookshelf } from '../../store/useBookshelf';
import { useBookSearch } from '../lib/useBookSearch';
import { BookCover } from '../atoms/BookCover';
import { IconButton } from '../atoms/IconButton';
import { AddButton } from '../molecules/AddButton';
import { SearchField } from '../molecules/SearchField';

const TASTE_CHIPS = ['Literary fiction', 'Sci-Fi', 'Mystery', 'Memoir', 'Fantasy', 'History'];
const GENRE_CHIPS: [string, string][] = [
  ['Fiction', '#4f7a6a'], ['Sci-Fi', '#45597e'], ['Fantasy', '#5b4a66'],
  ['History', '#9a6849'], ['Memoir', '#356a68'], ['Nonfiction', '#5a6a4d'],
];

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
  const trending = CATALOG.filter((c) => TRENDING_IDS.includes(c.id)).map((c, i) => ({ ...c, rank: i + 1 }));

  // While searching, render placeholder skeletons in place of result cards.
  const searchItems: Array<CatalogBook | { skeleton: number }> = searching
    ? Array.from({ length: 6 }, (_, i) => ({ skeleton: i }))
    : searchResults;

  return (
    <div className="mx-auto max-w-[1080px]">
      <h1 className="m-0 mb-1 font-display text-[30px] font-extrabold tracking-[-0.02em]">Discover</h1>
      <p className="m-0 mb-[22px] text-[15px] text-muted">Find your next great read — search, or wander through what we&apos;re loving.</p>

      <SearchField
        id="discover-search"
        label="Search books"
        value={query}
        onChange={setQuery}
        placeholder="Search by title, author, or genre…"
      />

      {/* Onboarding */}
      {!hasQuery && onboardVisible && (
        <div className="mt-[22px] rounded-2xl border border-[#e0e7e2] bg-[linear-gradient(120deg,#eef4f0,#f4f6f4)] px-6 py-[22px]">
          <div className="flex items-start justify-between gap-4">
            <div className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-accent">New here? Start your shelf</div>
            <IconButton label="Dismiss" variant="plain" onClick={dismissOnboard}>×</IconButton>
          </div>
          <p className="my-2 mb-4 max-w-[560px] text-[15px] text-ink-soft">
            Tell us a genre or two you love and we&apos;ll seed your library — no blank page, no homework.
          </p>
          <div className="flex flex-wrap gap-[9px]">
            {TASTE_CHIPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setQuery(g)}
                className="cursor-pointer rounded-[22px] border border-[#cdd8d1] bg-surface px-[15px] py-2 text-[13.5px] font-medium text-ink-soft"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {hasQuery && (
        <div className="mt-7">
          <div className="mb-[14px] font-mono text-[12px] uppercase tracking-[0.06em] text-faint">
            {searching
              ? <>Searching for &ldquo;{query}&rdquo;…</>
              : searchError
                ? <>Couldn&rsquo;t reach book search</>
                : <>{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;</>}
          </div>

          {searchError && (
            <div className="px-5 py-12 text-center text-faint">
              <div className="mb-2 text-[30px]">⚠</div>
              <div className="text-[15px]">Book search is temporarily unavailable. Please try again.</div>
            </div>
          )}
          {noResults && (
            <div className="px-5 py-12 text-center text-faint">
              <div className="mb-2 text-[30px]">⌕</div>
              <div className="text-[15px]">No matches for &ldquo;{query}&rdquo;. Try an author or a genre.</div>
            </div>
          )}

          <ul aria-label="Search results" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-0">
            {searchItems.map((item) =>
              'skeleton' in item ? (
                <li key={`sk-${item.skeleton}`} aria-hidden="true">
                  <div className="flex gap-[13px] rounded-[13px] border border-line bg-surface p-[14px]">
                    <div className="h-[81px] w-[54px] flex-none animate-pulse rounded-[5px] bg-line-soft" />
                    <div className="flex flex-1 flex-col gap-2 py-1">
                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-line-soft" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-line-soft" />
                      <div className="mt-auto h-7 w-16 animate-pulse rounded bg-line-soft" />
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.id}>
                  <div className="flex gap-[13px] rounded-[13px] border border-line bg-surface p-[14px]">
                    <BookCover color={item.cover} imageUrl={item.coverUrl} className="h-[81px] w-[54px] flex-none justify-end rounded-[5px] px-[7px] py-2 shadow-book-sm">
                      <div className="font-display text-[10px] font-bold leading-[1.1]">{truncateTitle(item.title)}</div>
                    </BookCover>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="text-[14px] font-semibold leading-[1.2]">{item.title}</div>
                      <div className="my-px mb-[6px] text-[12px] text-faint">{item.author}{item.pages ? ` · ${item.pages}p` : ''}</div>
                      <AddButton added={isAdded(item)} onClick={() => add(item)} className="mt-auto self-start px-[13px] py-1.5" />
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {/* Curated (no query) */}
      {!hasQuery && (
        <>
          <div className="mt-[34px]">
            <h2 className="m-0 mb-[3px] font-display text-[18px] font-bold">
              Because you read <span className="text-accent">Project Hail Mary</span>
            </h2>
            <p className="m-0 mb-4 text-[13.5px] text-faint">More of the thoughtful, character-driven stories you keep coming back to.</p>
            <ul aria-label="Recommendations" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[18px] p-0">
              {recommendations.map((b) => (
                <li key={b.id}>
                  <BookCover color={b.cover} imageUrl={b.coverUrl} className="aspect-[2/3] justify-between rounded-[7px] px-[13px] py-[14px] shadow-book">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] opacity-72">{b.genre}</div>
                    <div>
                      <div className="font-display text-[15px] font-bold leading-[1.14]">{b.title}</div>
                      <div className="mt-[5px] text-[11px] opacity-78">{b.author}</div>
                    </div>
                  </BookCover>
                  <AddButton added={isAdded(b)} onClick={() => add(b)} className="mt-[9px] w-full py-[7px]" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-9">
            <h2 className="m-0 mb-[14px] font-display text-[18px] font-bold">Trending this week</h2>
            <ul aria-label="Trending books" className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-lg border border-line bg-surface p-0">
              {trending.map((b) => (
                <li key={b.id} className="flex items-center gap-4 border-b border-[#f0f2f0] bg-surface px-[18px] py-[13px]">
                  <div className="w-[26px] font-display text-[22px] font-extrabold text-[#cbd3cd]">{b.rank}</div>
                  <BookCover color={b.cover} imageUrl={b.coverUrl} className="h-[50px] w-[34px] flex-none rounded-[4px] shadow-book-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-semibold">{b.title}</div>
                    <div className="text-[12.5px] text-faint">{b.author} · {b.genre}</div>
                  </div>
                  <AddButton added={isAdded(b)} onClick={() => add(b)} className="px-[14px] py-[7px]" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-9">
            <h2 className="m-0 mb-[14px] font-display text-[18px] font-bold">Browse by genre</h2>
            <div className="flex flex-wrap gap-[11px]">
              {GENRE_CHIPS.map(([name, bg]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setQuery(name)}
                  className="min-w-[120px] cursor-pointer rounded-[13px] border border-line px-[22px] py-[18px] text-left font-display text-[15px] font-bold text-white"
                  style={{ background: bg }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
