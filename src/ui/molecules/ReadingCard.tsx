'use client';

import type { Book } from '../../domain/book/book.types';
import { progressPct } from '../../domain/book/book.rules';
import { truncateTitle } from '../../domain/shared/format';
import { BookCover } from '../atoms/BookCover';
import { ProgressBar } from '../atoms/ProgressBar';

/** Wide "currently reading" card with cover, title and live progress. */
export function ReadingCard({ book, onOpen }: { book: Book; onOpen: (id: string) => void }) {
  const pct = progressPct(book.page, book.pages);

  return (
    <button
      className="fl-readcard flex flex-1 basis-[300px] cursor-pointer gap-4 rounded-lg border border-line bg-surface p-4 text-left shadow-card"
      style={{ minWidth: 280 }}
      onClick={() => onOpen(book.id)}
    >
      <BookCover color={book.cover} imageUrl={book.coverUrl} className="h-[93px] w-[62px] flex-none justify-end rounded-[5px] px-2 py-[9px] shadow-book-sm">
        <div className="font-display text-[11px] font-bold leading-[1.12]">{truncateTitle(book.title)}</div>
      </BookCover>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold leading-[1.25]">{book.title}</div>
        <div className="mt-px text-[12.5px] text-faint">{book.author}</div>
        <div className="mt-auto">
          <div className="mb-[5px] flex justify-between text-[12px] text-muted">
            <span className="font-mono font-medium text-accent">{pct}%</span>
            <span>p.{book.page} / {book.pages}</span>
          </div>
          <ProgressBar pct={pct} trackClassName="h-1.5" />
        </div>
      </div>
    </button>
  );
}
