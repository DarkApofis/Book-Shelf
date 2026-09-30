'use client';

import type { Book, BookStatus, ShelfTab } from '../../domain/book/book.types';
import { countByStatus, onShelf } from '../../domain/book/book.rules';
import { statusLabel } from '../../domain/shared/format';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useUiStore } from '../../store/useUiStore';
import { APP_TODAY, READING_GOAL } from '../../config/app';
import { GoalPanel } from '../molecules/GoalPanel';
import { ReadingRow } from '../molecules/ReadingRow';
import { ShelfBookCard } from '../molecules/ShelfBookCard';
import { cn } from '../lib/cn';

const SHELF_TABS: { key: ShelfTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reading', label: 'Reading' },
  { key: 'want', label: 'Want to read' },
  { key: 'finished', label: 'Read' },
];

/** On "All", the grid groups by shelf; "Currently reading" is already listed above. */
const ALL_SECTIONS: BookStatus[] = ['want', 'finished'];

function ShelfGrid({ books, onOpen }: { books: Book[]; onOpen: (id: string) => void }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(98px,1fr))] gap-x-4 gap-y-6 p-0 nav:grid-cols-[repeat(auto-fill,minmax(132px,1fr))] nav:gap-x-6 nav:gap-y-8">
      {books.map((b) => <li key={b.id} className="min-w-0"><ShelfBookCard book={b} onOpen={onOpen} /></li>)}
    </ul>
  );
}

function SectionHeading({ id, label, count, action }: { id: string; label: string; count: number; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h2 id={id} className="m-0 font-display text-[17px] font-semibold tracking-[-0.01em]">
        {label} <span className="ml-1 font-sans text-[14px] font-medium tabular-nums text-muted">{count}</span>
      </h2>
      {action}
    </div>
  );
}

function EmptyShelf({ label }: { label: string }) {
  const navigate = useUiStore((s) => s.navigate);
  return (
    <div className="rounded-[10px] border border-dashed border-line-strong px-6 py-10 text-center">
      <p className="m-0 text-[15px] font-semibold">Nothing on {label} yet</p>
      <p className="mx-auto mb-4 mt-1 max-w-[340px] text-[14px] text-muted">Search Open Library for a book and add it to your shelves.</p>
      <button type="button" onClick={() => navigate('discover')} className="h-10 cursor-pointer rounded-lg border border-line bg-surface px-4 text-[14px] font-semibold text-ink hover:bg-sidebar">
        Find a book
      </button>
    </div>
  );
}

export function LibraryView() {
  const books = useLibraryStore((s) => s.books);
  const shelf = useUiStore((s) => s.shelf);
  const setShelf = useUiStore((s) => s.setShelf);
  const selectBook = useUiStore((s) => s.selectBook);

  const reading = books.filter((b) => b.status === 'reading');
  const { target, read } = READING_GOAL;
  const countFor = (key: ShelfTab) => (key === 'all' ? books.length : countByStatus(books, key));

  return (
    <div className="mx-auto max-w-[var(--library-max-width)] px-5 pb-10 nav:px-10">
      <div className="pb-7 pt-6">
        <h1 className="m-0 font-display text-[30px] font-bold leading-[1.15] tracking-[-0.025em]">Library</h1>
        <p className="mb-0 mt-1.5 text-[14px] tabular-nums text-muted">
          {books.length} {books.length === 1 ? 'book' : 'books'}
          <span aria-hidden="true" className="mx-1.5 text-line-strong">·</span>
          {reading.length} in progress
          <span aria-hidden="true" className="mx-1.5 text-line-strong">·</span>
          {read} finished in {APP_TODAY.getFullYear()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-7 nav:grid-cols-[minmax(0,1fr)_320px] nav:gap-10">
        <section aria-labelledby="cr-h" className="min-w-0">
          <div className="flex items-baseline justify-between border-b border-line pb-2.5">
            <h2 id="cr-h" className="m-0 font-display text-[17px] font-semibold tracking-[-0.01em]">Currently reading</h2>
            {reading.length > 0 && (
              <button type="button" onClick={() => setShelf('reading')} className="cursor-pointer border-none bg-transparent p-0 text-[13.5px] font-medium text-accent-ink hover:underline">
                View shelf
              </button>
            )}
          </div>
          {reading.length > 0 ? (
            <ul className="m-0 list-none p-0">
              {reading.map((b) => <ReadingRow key={b.id} book={b} onOpen={selectBook} />)}
            </ul>
          ) : (
            <p className="m-0 py-6 text-[14px] text-muted">Nothing in progress. Open a book from Want to read and start it.</p>
          )}
        </section>
        <GoalPanel read={read} target={target} today={APP_TODAY} />
      </div>

      <div className="mt-10 border-b border-line">
        <div role="tablist" aria-label="Shelves" className="-mb-px flex gap-[22px] overflow-x-auto">
          {SHELF_TABS.map((t) => {
            const active = shelf === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setShelf(t.key)}
                className={cn(
                  'inline-flex h-11 flex-none cursor-pointer items-center gap-[7px] border-x-0 border-t-0 border-b-2 bg-transparent p-0 text-[14px]',
                  active ? 'border-ink font-semibold text-ink' : 'border-transparent font-medium text-muted hover:text-ink',
                )}
              >
                {t.label}
                <span className="text-[12.5px] font-medium tabular-nums text-muted">{countFor(t.key)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel">
        {shelf === 'all' && books.length === 0 ? (
          <div className="mt-7"><EmptyShelf label="your shelves" /></div>
        ) : shelf === 'all' ? (
          ALL_SECTIONS.map((status) => {
            const list = onShelf(books, status);
            if (list.length === 0) return null;
            return (
              <section key={status} aria-labelledby={`sec-${status}`} className="mt-7">
                <SectionHeading
                  id={`sec-${status}`}
                  label={statusLabel(status)}
                  count={list.length}
                  action={
                    <button type="button" onClick={() => setShelf(status)} className="cursor-pointer border-none bg-transparent p-0 text-[13.5px] font-medium text-accent-ink hover:underline">
                      See all
                    </button>
                  }
                />
                <ShelfGrid books={list} onOpen={selectBook} />
              </section>
            );
          })
        ) : (
          <section aria-labelledby="sec-shelf" className="mt-7">
            {(() => {
              const list = onShelf(books, shelf);
              const label = statusLabel(shelf);
              return (
                <>
                  <SectionHeading id="sec-shelf" label={label} count={list.length} />
                  {list.length > 0 ? <ShelfGrid books={list} onOpen={selectBook} /> : <EmptyShelf label={label} />}
                </>
              );
            })()}
          </section>
        )}
      </div>
    </div>
  );
}
