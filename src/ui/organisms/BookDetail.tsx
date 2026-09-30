'use client';

import { useEffect, useState } from 'react';
import type { Book, BookStatus } from '../../domain/book/book.types';
import { clampPage, pagesLeft, progressPct } from '../../domain/book/book.rules';
import { estimatePace } from '../../domain/reading/pace';
import { statusLabel } from '../../domain/shared/format';
import { APP_TODAY } from '../../config/app';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useUiStore } from '../../store/useUiStore';
import { useBookshelf } from '../../store/useBookshelf';
import { BookCover } from '../atoms/BookCover';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { ProgressBar } from '../atoms/ProgressBar';
import { RatingStars } from '../atoms/RatingStars';
import { cn } from '../lib/cn';

const SHELF_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: 'want', label: 'Want to read' },
  { value: 'reading', label: 'Currently reading' },
  { value: 'finished', label: 'Read' },
];

const STATUS_TONE: Record<BookStatus, string> = {
  reading: 'text-reading',
  want: 'text-want',
  finished: 'text-finished',
};

const STATUS_DOT: Record<BookStatus, string> = {
  reading: 'bg-reading',
  want: 'bg-want',
  finished: 'bg-finished',
};

function sectionClass(first = false) {
  return cn('border-t border-line pt-6', first ? 'mt-8' : 'mt-9');
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="m-0 font-display text-[17px] font-semibold tracking-[-0.01em]">{children}</h2>;
}

/** Shelf select + rating — shown under the cover on desktop, under the title on phones. */
function ShelfAndRating({ book, idSuffix }: { book: Book; idSuffix: string }) {
  const rateBook = useLibraryStore((s) => s.rateBook);
  const { start, finish, shelve } = useBookshelf();

  const changeShelf = (next: BookStatus) => {
    if (next === book.status) return;
    if (next === 'reading') start(book.id);
    else if (next === 'finished') finish(book.id);
    else shelve(book.id);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-muted">
        Shelf
        <select
          id={`shelf-${idSuffix}`}
          value={book.status}
          onChange={(e) => changeShelf(e.target.value as BookStatus)}
          className="h-11 cursor-pointer rounded-lg border border-line bg-surface px-3 text-[15px] font-medium text-ink"
        >
          {SHELF_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      <div className="flex items-center justify-between nav:block">
        <span className="text-[12.5px] font-semibold text-muted">Your rating</span>
        <RatingStars rating={book.rating} onRate={(r) => rateBook(book.id, r)} />
      </div>
    </div>
  );
}

function ProgressSection({ book }: { book: Book }) {
  const setBookPage = useLibraryStore((s) => s.setBookPage);
  const { finish } = useBookshelf();
  const [draft, setDraft] = useState(String(book.page));
  const pct = progressPct(book.page, book.pages);
  const pace = estimatePace(book, APP_TODAY);
  const atEnd = book.pages > 0 && book.page >= book.pages;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookPage(book.id, clampPage(parseInt(draft, 10), book.pages));
  };

  return (
    <section aria-labelledby="prog-h" className={sectionClass(true)}>
      <SectionTitle id="prog-h">Progress</SectionTitle>
      <div className="mt-4 flex items-baseline justify-between gap-3 tabular-nums">
        <span className="font-display text-[34px] font-bold leading-none tracking-[-0.03em]">{pct}%</span>
        <span className="text-[14px] text-ink-soft">Page {book.page} of {book.pages}</span>
      </div>
      <ProgressBar
        pct={pct}
        trackClassName="mt-3 h-1.5 rounded-full"
        fillClassName="rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
        labelledProgress={`Reading progress: ${pct}% complete`}
      />

      {atEnd ? (
        <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-line bg-sidebar p-4">
          <span className="text-[14px] font-semibold">You&apos;ve reached the last page.</span>
          <Button onClick={() => finish(book.id)} className="h-10 px-4 text-[14px]">Mark as read</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 flex max-w-[420px] items-end gap-2.5">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5 text-[12.5px] font-semibold text-muted">
            Current page
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={book.pages}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-11 rounded-lg border border-line bg-surface px-3 text-[16px] font-medium tabular-nums text-ink"
            />
          </label>
          <Button type="submit" className="h-11 px-5 text-[14.5px]">Update</Button>
        </form>
      )}

      {book.sessions && book.sessions.length > 0 && (
        <div className="mt-6 text-[14px] tabular-nums">
          <div className="pb-2 text-[12.5px] font-semibold text-muted">Recent sessions</div>
          <ul className="m-0 list-none p-0">
            {book.sessions.map((s, i) => (
              <li key={i} className="flex justify-between border-t border-line py-[11px]">
                <span>{s.date}</span>
                <span className="text-ink-soft">{s.pages} pages</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pace && !atEnd && (
        <p className="mb-0 mt-3.5 text-[13.5px] text-muted">
          About {pace.pace} pages a day — {pagesLeft(book)} left, finishing around {pace.estFinish}.
        </p>
      )}
    </section>
  );
}

/** Full-page view of one library book. Replaces the old side drawer. */
export function BookDetail() {
  const selectedId = useUiStore((s) => s.selectedId);
  const justFinished = useUiStore((s) => s.justFinished);
  const closeBook = useUiStore((s) => s.closeBook);
  const book = useLibraryStore((s) => s.books.find((b) => b.id === selectedId) ?? null);
  const { start } = useBookshelf();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [selectedId]);

  if (!book) return null;

  const meta = [book.genre, book.pages ? `${book.pages} pages` : null].filter(Boolean).join(' · ');
  const openLibraryUrl = book.sourceId?.startsWith('/works/') ? `https://openlibrary.org${book.sourceId}` : null;
  const details = [
    book.pages ? { k: 'Pages', v: String(book.pages) } : null,
    book.genre ? { k: 'Genre', v: book.genre } : null,
    { k: 'Shelf', v: statusLabel(book.status) },
    book.started ? { k: 'Started', v: book.started } : null,
  ].filter((d): d is { k: string; v: string } => d !== null);

  const openLibraryLink = openLibraryUrl && (
    <a href={openLibraryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent-ink">
      Open Library <Icon name="external" size={14} /><span className="sr-only">(opens in a new tab)</span>
    </a>
  );

  return (
    <article className="mx-auto max-w-[1040px] px-5 pb-12 nav:px-10">
      <div className="pt-3 nav:hidden">
        <button type="button" onClick={closeBook} className="-ml-2 inline-flex min-h-11 cursor-pointer items-center gap-0.5 border-none bg-transparent pr-2 text-[15px] font-medium text-ink">
          <Icon name="back" size={22} /> Library
        </button>
      </div>
      <nav aria-label="Breadcrumb" className="hidden pt-[22px] text-[13.5px] text-muted nav:block">
        <button type="button" onClick={closeBook} className="cursor-pointer border-none bg-transparent p-0 text-muted hover:text-ink hover:underline">Library</button>
        <span aria-hidden="true" className="mx-2">/</span>
        <span className="text-ink" aria-current="page">{book.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 pt-4 nav:grid-cols-[260px_minmax(0,1fr)] nav:gap-14 nav:pt-6">
        <div className="hidden self-start nav:sticky nav:top-24 nav:block">
          <BookCover title={book.title} author={book.author} imageUrl={book.coverUrl} size="lg" className="w-full" />
          <div className="mt-6 flex flex-col gap-4">
            <ShelfAndRating book={book} idSuffix="desk" />
            {openLibraryLink}
          </div>
        </div>

        <div className="min-w-0">
          <div className="grid grid-cols-[104px_minmax(0,1fr)] items-end gap-[18px] nav:block">
            <BookCover title={book.title} author={book.author} imageUrl={book.coverUrl} className="w-[104px] nav:hidden" />
            <div>
              <div className={cn('flex items-center gap-[7px] text-[13px] font-semibold', STATUS_TONE[book.status])}>
                <span aria-hidden="true" className={cn('h-[7px] w-[7px] rounded-full', STATUS_DOT[book.status])} />
                {statusLabel(book.status)}
              </div>
              <h1 className="mb-1 mt-2 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.025em]">{book.title}</h1>
              <p className="m-0 text-[16px] text-ink-soft">{book.author}</p>
              {meta && <p className="mb-0 mt-1.5 text-[13.5px] text-muted">{meta}</p>}
            </div>
          </div>

          <div className="mt-5 nav:hidden">
            <ShelfAndRating book={book} idSuffix="phone" />
          </div>

          {justFinished && (
            <div role="status" className="mt-6 flex items-center gap-3 rounded-[10px] border border-line bg-accent-soft p-4">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent text-white"><Icon name="check" size={18} strokeWidth={2.2} /></span>
              <div>
                <div className="text-[15px] font-semibold">Finished — nicely done.</div>
                <div className="text-[13.5px] text-muted">It&apos;s on your Read shelf. How many stars?</div>
              </div>
            </div>
          )}

          {/* Keyed by page so the input resets whenever the page changes elsewhere. */}
          {book.status === 'reading' && <ProgressSection key={`${book.id}:${book.page}`} book={book} />}

          {book.status === 'want' && (
            <section aria-labelledby="start-h" className={sectionClass(true)}>
              <SectionTitle id="start-h">Ready when you are</SectionTitle>
              <p className="mb-4 mt-2 max-w-[56ch] text-[14.5px] text-muted">Start it and Folio begins tracking your progress from page one.</p>
              <Button onClick={() => start(book.id)} className="h-11 px-5 text-[14.5px]">Start reading</Button>
            </section>
          )}

          {book.status === 'finished' && !justFinished && (
            <section aria-labelledby="done-h" className={sectionClass(true)}>
              <SectionTitle id="done-h">Finished</SectionTitle>
              <ProgressBar pct={100} trackClassName="mt-4 h-1.5 rounded-full" fillClassName="rounded-full" />
              <Button variant="secondary" onClick={() => start(book.id)} className="mt-5 h-11 px-5 text-[14.5px]">Read again</Button>
            </section>
          )}

          <section aria-labelledby="det-h" className={sectionClass()}>
            <SectionTitle id="det-h">Details</SectionTitle>
            <dl className="mb-0 mt-3 text-[14.5px]">
              {details.map((d) => (
                <div key={d.k} className="flex justify-between gap-4 border-b border-line py-[11px]">
                  <dt className="text-muted">{d.k}</dt>
                  <dd className="m-0 text-right font-medium tabular-nums">{d.v}</dd>
                </div>
              ))}
            </dl>
            {openLibraryLink && <div className="mt-[18px] nav:hidden">{openLibraryLink}</div>}
          </section>
        </div>
      </div>
    </article>
  );
}
