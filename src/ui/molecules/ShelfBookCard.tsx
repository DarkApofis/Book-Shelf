'use client';

import type { Book } from '../../domain/book/book.types';
import { BookCover } from '../atoms/BookCover';
import { RatingBadge } from '../atoms/RatingStars';

/** Cover-first tile for the shelf grid: cover, then title, author and rating. */
export function ShelfBookCard({ book, onOpen }: { book: Book; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(book.id)}
      className="group flex w-full min-w-0 cursor-pointer flex-col gap-2.5 border-none bg-transparent p-0 text-left text-ink"
    >
      <BookCover
        title={book.title}
        author={book.author}
        imageUrl={book.coverUrl}
        className="w-full transition-[transform,box-shadow] duration-200 group-hover:-translate-y-[3px] group-hover:shadow-[0_0_0_1px_rgba(24,33,34,0.08),0_12px_24px_rgba(24,33,34,0.16)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      />
      <span className="block min-w-0">
        <span className="line-clamp-2 text-[13.5px] font-semibold leading-[1.35]">{book.title}</span>
        <span className="mt-px block truncate text-[12.5px] text-muted">{book.author}</span>
        {book.rating > 0 && <span className="mt-1 block"><RatingBadge rating={book.rating} /></span>}
      </span>
    </button>
  );
}
