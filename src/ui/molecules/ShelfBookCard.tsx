'use client';

import type { Book } from '../../domain/book/book.types';
import { progressPct } from '../../domain/book/book.rules';
import { formatRating, statusLabel } from '../../domain/shared/format';
import { BookCover } from '../atoms/BookCover';

/** Spine-style book tile for the shelf grid. */
export function ShelfBookCard({ book, onOpen }: { book: Book; onOpen: (id: string) => void }) {
  const pct = progressPct(book.page, book.pages);

  return (
    <button onClick={() => onOpen(book.id)} className="w-full cursor-pointer border-none bg-transparent p-0 text-left">
      <BookCover
        color={book.cover}
        imageUrl={book.coverUrl}
        className="aspect-[2/3] justify-between rounded-[7px] px-[13px] py-[14px] shadow-book"
        progressPct={book.status === 'reading' ? pct : undefined}
      >
        <div className="font-mono text-[9.5px] uppercase tracking-[0.06em] opacity-72">{book.genre}</div>
        <div>
          <div className="font-display text-[15px] font-bold leading-[1.14]">{book.title}</div>
          <div className="mt-[5px] text-[11px] opacity-78">{book.author}</div>
        </div>
      </BookCover>
      <div className="mt-[9px] flex items-center justify-between gap-1.5">
        <span className="text-[11.5px] font-medium text-muted">{statusLabel(book.status)}</span>
        <span className="font-mono text-[11.5px] text-faint">{formatRating(book.rating)}</span>
      </div>
    </button>
  );
}
