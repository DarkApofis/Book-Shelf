'use client';

import { pagesLeft, progressPct } from '../../domain/book/book.rules';
import { estimatePace } from '../../domain/reading/pace';
import { formatRating, truncateTitle } from '../../domain/shared/format';
import { APP_TODAY } from '../../config/app';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useUiStore } from '../../store/useUiStore';
import { useBookshelf } from '../../store/useBookshelf';
import { BookCover } from '../atoms/BookCover';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';
import { ProgressBar } from '../atoms/ProgressBar';
import { StatTile } from '../atoms/StatTile';
import { StatusBadge } from '../atoms/StatusBadge';
import { SrOnlyLabel } from '../atoms/SrOnlyLabel';

const PAGE_BUMPS = [10, 25, 50];

export function BookDrawer() {
  const selectedId = useUiStore((s) => s.selectedId);
  const justFinished = useUiStore((s) => s.justFinished);
  const closeBook = useUiStore((s) => s.closeBook);
  const book = useLibraryStore((s) => s.books.find((b) => b.id === selectedId) ?? null);
  const setBookPage = useLibraryStore((s) => s.setBookPage);
  const bumpPage = useLibraryStore((s) => s.bumpPage);
  const { finish, start } = useBookshelf();

  if (!book) return null;

  const pct = progressPct(book.page, book.pages);
  const pace = estimatePace(book, APP_TODAY);

  return (
    <>
      <div onClick={closeBook} aria-hidden="true" className="fixed inset-0 z-50 bg-[rgba(20,28,27,0.42)]" />
      <div
        className="fl-drawer fixed inset-y-0 right-0 z-[51] w-[436px] max-w-full overflow-y-auto bg-sidebar shadow-drawer"
        role="dialog"
        aria-label={`${book.title} details`}
        aria-modal="true"
      >
        <div className="px-[26px] pb-[30px] pt-[22px]">
          <div className="flex justify-end">
            <IconButton label="Close" onClick={closeBook}>×</IconButton>
          </div>

          {/* Header */}
          <div className="mt-1 flex gap-[18px]">
            <BookCover color={book.cover} imageUrl={book.coverUrl} className="h-[144px] w-[96px] flex-none justify-end rounded-[7px] px-3 py-[13px] shadow-book">
              <div className="font-display text-[13px] font-bold leading-[1.12]">{truncateTitle(book.title)}</div>
            </BookCover>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-faint">{book.genre}</div>
              <h2 className="my-[6px] mb-1 font-display text-[20px] font-bold leading-[1.16]">{book.title}</h2>
              <div className="text-[13.5px] text-muted">{book.author}</div>
              <div className="mt-2 text-[12.5px] text-faint">{book.pages} pages · {formatRating(book.rating)}</div>
              <StatusBadge status={book.status} className="mt-2.5" />
            </div>
          </div>

          {/* Celebration */}
          {justFinished && (
            <div className="mt-[22px] flex items-center gap-[13px] rounded-lg border border-accent-line bg-accent-soft p-[18px]">
              <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-accent text-[18px] text-white">✓</div>
              <div>
                <div className="text-[15px] font-bold">Finished — nicely done.</div>
                <div className="text-[12.5px] text-muted">Added to your 2026 shelf. Rate it below?</div>
              </div>
            </div>
          )}

          {/* Reading */}
          {book.status === 'reading' && (
            <div className="mt-6">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-mono text-[22px] font-semibold text-accent">{pct}%</span>
                <span className="text-[13px] text-muted">page {book.page} of {book.pages} · {pagesLeft(book)} left</span>
              </div>
              <ProgressBar
                pct={pct}
                trackClassName="h-[9px] rounded-md"
                fillClassName="rounded-md transition-[width] duration-300 ease-out"
                labelledProgress={`Reading progress: ${pct}% complete`}
              />

              <SrOnlyLabel htmlFor="page-slider">Page slider</SrOnlyLabel>
              <input
                id="page-slider"
                type="range"
                min={0}
                max={book.pages}
                value={book.page}
                onChange={(e) => setBookPage(book.id, parseInt(e.target.value, 10))}
                className="mt-[14px] w-full cursor-pointer"
              />

              <div className="mt-[18px] flex items-center gap-[9px]">
                <span className="text-[12.5px] font-medium text-muted">I&apos;m on page</span>
                <SrOnlyLabel htmlFor="page-input">Current page</SrOnlyLabel>
                <input
                  id="page-input"
                  type="number"
                  value={book.page}
                  min={0}
                  max={book.pages}
                  onChange={(e) => setBookPage(book.id, parseInt(e.target.value, 10))}
                  className="w-[78px] rounded-md border border-line-strong px-2.5 py-2 text-center text-[14px] text-ink"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {PAGE_BUMPS.map((d) => (
                  <Button key={d} variant="secondary" onClick={() => bumpPage(book.id, d)} className="px-[14px] py-[9px] text-[13px] text-[#3c4a48]">
                    +{d}
                  </Button>
                ))}
                <Button onClick={() => finish(book.id)} className="ml-auto px-4 py-[9px] text-[13px]">Mark finished</Button>
              </div>

              <div className="mt-[22px] grid grid-cols-3 gap-2.5">
                <StatTile label="Pace" value={pace?.pace ?? '—'} sub="pages/day" />
                <StatTile label="Est. finish" value={pace?.estFinish ?? '—'} sub={`${pace?.daysLeft ?? 0} days`} />
                <StatTile label="Started" value={book.started ?? '—'} sub={`${pace?.daysIn ?? 0} days ago`} />
              </div>

              {book.sessions && book.sessions.length > 0 && (
                <div className="mt-6">
                  <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-faint">Recent sessions</div>
                  <div className="flex flex-col gap-px">
                    {book.sessions.map((s, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-line-soft px-0.5 py-2.5 text-[13px]">
                        <span className="text-muted">{s.date}</span>
                        <span className="font-semibold text-accent">+{s.pages} pages</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Want */}
          {book.status === 'want' && (
            <div className="mt-6">
              <p className="m-0 mb-[18px] text-[14px] leading-[1.5] text-muted">
                On your shelf, waiting. Start it whenever you&apos;re ready — we&apos;ll begin tracking your progress from page one.
              </p>
              <Button onClick={() => start(book.id)} className="w-full rounded-[11px] p-[13px] text-[14.5px]">Start reading</Button>
            </div>
          )}

          {/* Finished */}
          {book.status === 'finished' && !justFinished && (
            <div className="mt-6">
              <ProgressBar pct={100} trackClassName="h-[9px] rounded-md" />
              <div className="mt-[9px] flex justify-between text-[13px] text-muted">
                <span>Completed</span>
                <span>{formatRating(book.rating)}</span>
              </div>
              <Button variant="secondary" onClick={() => start(book.id)} className="mt-5 w-full rounded-[11px] p-3 text-[14px] text-[#3c4a48]">
                Read again
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
