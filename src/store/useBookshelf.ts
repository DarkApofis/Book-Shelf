/**
 * Composition hook that orchestrates the library and UI stores for the few
 * actions that span both (mutate a book + show feedback). Components use this
 * instead of reaching into two stores and duplicating the toast copy.
 */
'use client';

import type { CatalogBook } from '../domain/book/book.types';
import { useLibraryStore } from './useLibraryStore';
import { useUiStore } from './useUiStore';

export function useBookshelf() {
  const finishBook = useLibraryStore((s) => s.finishBook);
  const startBook = useLibraryStore((s) => s.startBook);
  const addBook = useLibraryStore((s) => s.addBook);
  const markFinished = useUiStore((s) => s.markFinished);
  const showToast = useUiStore((s) => s.showToast);

  return {
    finish: (id: string) => {
      finishBook(id);
      markFinished();
      showToast('Finished — added to your 2026 shelf');
    },
    start: (id: string) => {
      startBook(id);
      showToast('Started reading — happy turning');
    },
    add: (book: CatalogBook) => {
      if (addBook(book)) showToast('Added to "Want to read"');
    },
    share: () => showToast('Share image saved to your downloads'),
  };
}
