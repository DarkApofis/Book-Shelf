'use client';

import type { Book } from '../../domain/book/book.types';
import { progressPct } from '../../domain/book/book.rules';
import { BookCover } from '../atoms/BookCover';
import { Icon } from '../atoms/Icon';
import { ProgressBar } from '../atoms/ProgressBar';

/** A "currently reading" list row: thumbnail, title, and a slim progress bar. */
export function ReadingRow({ book, onOpen }: { book: Book; onOpen: (id: string) => void }) {
  const pct = progressPct(book.page, book.pages);

  return (
    <li className="flex items-center gap-3.5 border-b border-line py-3.5">
      <button
        type="button"
        onClick={() => onOpen(book.id)}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 border-none bg-transparent p-0 text-left text-ink"
      >
        <BookCover title={book.title} author={book.author} imageUrl={book.coverUrl} size="sm" className="w-11 flex-none" />
        <span className="block min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold">{book.title}</span>
          <span className="block truncate text-[13.5px] text-muted">{book.author}</span>
          <span className="mt-2 flex items-center gap-3">
            <ProgressBar pct={pct} trackClassName="h-1 flex-1 rounded-full" fillClassName="rounded-full" labelledProgress={`${book.title}: ${pct}% read`} />
            <span className="flex-none text-[12.5px] tabular-nums text-ink-soft">
              {pct}%<span className="hidden text-muted nav:inline"> · p. {book.page} of {book.pages}</span>
            </span>
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label={`Update progress for ${book.title}`}
        onClick={() => onOpen(book.id)}
        className="grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-lg border border-line bg-surface text-ink-soft hover:bg-sidebar"
      >
        <Icon name="edit" size={17} />
      </button>
    </li>
  );
}
