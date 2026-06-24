'use client';

import type { ShelfTab } from '../../domain/book/book.types';
import { onShelf } from '../../domain/book/book.rules';
import { useLibraryStore } from '../../store/useLibraryStore';
import { useUiStore } from '../../store/useUiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_TODAY, READER, READING_GOAL } from '../../config/app';
import { ReadingCard } from '../molecules/ReadingCard';
import { ShelfBookCard } from '../molecules/ShelfBookCard';
import { Chip } from '../atoms/Chip';

const SHELF_TABS: { key: ShelfTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reading', label: 'Reading' },
  { key: 'want', label: 'Want to read' },
  { key: 'finished', label: 'Finished' },
];

const DATE_LABEL = APP_TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

function greeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function LibraryView() {
  const books = useLibraryStore((s) => s.books);
  const shelf = useUiStore((s) => s.shelf);
  const setShelf = useUiStore((s) => s.setShelf);
  const selectBook = useUiStore((s) => s.selectBook);
  const readerName = useAuthStore((s) => s.user?.name ?? READER.name);

  const reading = books.filter((b) => b.status === 'reading');
  const shelfList = onShelf(books, shelf);
  const { target, read } = READING_GOAL;
  const goalPct = Math.min(100, Math.round((read / target) * 100));

  return (
    <div className="mx-auto max-w-[1080px]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-faint">{DATE_LABEL}</div>
          <h1 className="my-[6px] mb-0.5 font-display text-[34px] font-extrabold tracking-[-0.02em]">
            {greeting(new Date().getHours())}, {readerName}.
          </h1>
          <p className="m-0 text-[15px] text-muted">
            You&apos;re reading {reading.length} book{reading.length !== 1 ? 's' : ''} right now — {read} finished so far in 2026.
          </p>
        </div>
        <div className="flex items-center gap-[18px]">
          <div
            role="progressbar"
            aria-valuenow={read}
            aria-valuemin={0}
            aria-valuemax={target}
            aria-label={`Reading goal: ${read} of ${target} books`}
            className="grid h-[92px] w-[92px] place-items-center rounded-full"
            style={{ background: `conic-gradient(var(--color-accent) ${goalPct * 3.6}deg, #e4e8e5 0)` }}
          >
            <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-paper leading-none">
              <div className="font-display text-[20px] font-extrabold">{read}</div>
              <div className="mt-0.5 text-[10px] text-faint">of {target}</div>
            </div>
          </div>
          <div className="max-w-[120px] text-[12.5px] text-muted">
            2026 reading goal<br />
            <span className="font-semibold text-accent">{goalPct}% there</span>
          </div>
        </div>
      </div>

      {/* Currently reading */}
      <div className="mb-[14px] mt-[34px] flex items-center justify-between">
        <h2 className="m-0 font-display text-[18px] font-bold">Currently reading</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {reading.map((b) => <ReadingCard key={b.id} book={b} onOpen={selectBook} />)}
      </div>

      {/* Shelves */}
      <div className="mb-4 mt-[38px] flex flex-wrap items-center gap-2">
        <h2 className="m-0 mr-3 font-display text-[18px] font-bold">Your shelves</h2>
        {SHELF_TABS.map((t) => (
          <Chip key={t.key} active={shelf === t.key} onClick={() => setShelf(t.key)}>{t.label}</Chip>
        ))}
      </div>

      {/* Book grid */}
      <ul
        aria-label="Books on shelf"
        className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-x-[18px] gap-y-5 p-0"
      >
        {shelfList.map((b) => (
          <li key={b.id}><ShelfBookCard book={b} onOpen={selectBook} /></li>
        ))}
      </ul>
    </div>
  );
}
