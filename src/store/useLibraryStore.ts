/**
 * Library store — owns the reader's book collection (domain state). Every
 * mutation delegates to pure `book.rules` functions; the store only handles
 * identity (find by id) and immutable array updates.
 *
 * Two modes:
 *  - Guest / unconfigured: books live in memory only (spec: guests don't persist).
 *  - Member (userId set): the same mutations apply optimistically, then persist to
 *    Supabase in the background. On a write failure we refetch to reconcile rather
 *    than guess at a rollback.
 */
import { create } from 'zustand';
import type { Book, CatalogBook } from '../domain/book/book.types';
import {
  bumpPage as bumpPageRule,
  finishReading,
  fromCatalog,
  setPage as setPageRule,
  setRating as setRatingRule,
  shelveForLater,
  startReading,
} from '../domain/book/book.rules';
import { toDateLabel } from '../domain/shared/format';
import { APP_TODAY } from '../config/app';
import { CATALOG } from '../data/catalog.seed';
import { INITIAL_BOOKS } from '../data/books.seed';
import { booksRepo } from '../data/booksRepo';

interface LibraryState {
  books: Book[];
  /** Catalog ids already pulled onto a shelf (drives Discover's "Added" state). */
  addedIds: string[];
  /** Signed-in reader id, or null in guest/unconfigured mode. */
  userId: string | null;

  /** Load a member's library from Supabase and switch into persistent mode. */
  loadMember: (userId: string) => Promise<void>;
  /** Reset to the in-memory seed (guest sign-in). */
  loadGuest: () => void;

  setBookPage: (id: string, page: number) => void;
  bumpPage: (id: string, delta: number) => void;
  startBook: (id: string) => void;
  finishBook: (id: string) => void;
  rateBook: (id: string, rating: number) => void;
  /** Move a book back to "want to read" (progress cleared). */
  shelveBook: (id: string) => void;
  /**
   * Add a catalog/search book to the "want to read" shelf. Returns true if newly
   * added (false if its id is already on a shelf this session).
   */
  addBook: (entry: CatalogBook) => boolean;
}

/** Which catalog entries are already on the shelf, matched by title + author. */
function deriveAddedIds(books: Book[]): string[] {
  return CATALOG.filter((c) =>
    books.some((b) => b.title === c.title && b.author === c.author),
  ).map((c) => c.id);
}

export const useLibraryStore = create<LibraryState>((set, get) => {
  const patch = (id: string, makePatch: (book: Book) => Partial<Book>) => {
    const book = get().books.find((b) => b.id === id);
    if (!book) return null;
    const delta = makePatch(book);
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? { ...b, ...delta } : b)),
    }));
    return delta;
  };

  /** Hard-replace local state with server truth (discards failed optimistic writes). */
  const refresh = async () => {
    try {
      const books = await booksRepo.fetchLibrary();
      set({ books, addedIds: deriveAddedIds(books) });
    } catch (err) {
      console.error('Library refetch failed.', err);
    }
  };

  /** Recover from a failed background write by refetching the source of truth. */
  const reconcile = (err: unknown) => {
    console.error('Library sync failed; refetching to reconcile.', err);
    void refresh();
  };

  return {
    books: [],
    addedIds: [],
    userId: null,

    loadMember: async (userId) => {
      // Enter persistent mode synchronously — mutations made before the initial
      // fetch resolves must still persist, so mode can't wait on the network.
      // Clear any guest/seed books so member mode never shows another source's data.
      set({ userId, books: [], addedIds: [] });
      const fetched = await booksRepo.fetchLibrary();
      // Merge, don't clobber: a book added during the fetch window has a fresh id
      // not yet in the server response — keep it (it's already being persisted).
      set((state) => {
        const serverIds = new Set(fetched.map((b) => b.id));
        const pending = state.books.filter((b) => !serverIds.has(b.id));
        const books = [...fetched, ...pending];
        return { books, addedIds: deriveAddedIds(books) };
      });
    },

    loadGuest: () => set({ books: INITIAL_BOOKS, addedIds: [], userId: null }),

    setBookPage: (id, page) => {
      const delta = patch(id, (b) => setPageRule(b, page));
      const { userId } = get();
      if (delta && userId) booksRepo.updateBook(id, delta).catch(reconcile);
    },

    bumpPage: (id, delta) => {
      const applied = patch(id, (b) => bumpPageRule(b, delta));
      const { userId } = get();
      if (applied && userId) booksRepo.updateBook(id, applied).catch(reconcile);
    },

    startBook: (id) => {
      const delta = patch(id, () => startReading(toDateLabel(APP_TODAY)));
      const { userId } = get();
      if (delta && userId) {
        booksRepo
          .updateBook(id, delta)
          .then(() => booksRepo.clearSessions(id))
          .catch(reconcile);
      }
    },

    finishBook: (id) => {
      const delta = patch(id, (b) => finishReading(b));
      const { userId } = get();
      if (delta && userId) booksRepo.updateBook(id, delta).catch(reconcile);
    },

    rateBook: (id, rating) => {
      const delta = patch(id, () => setRatingRule(rating));
      const { userId } = get();
      if (delta && userId) booksRepo.updateBook(id, delta).catch(reconcile);
    },

    shelveBook: (id) => {
      const delta = patch(id, () => shelveForLater());
      const { userId } = get();
      if (delta && userId) booksRepo.updateBook(id, delta).catch(reconcile);
    },

    addBook: (entry) => {
      if (get().addedIds.includes(entry.id)) return false;

      const { userId } = get();
      const base = fromCatalog(entry);
      // Members get a real uuid so background persistence and later updates align;
      // the source id stays on the book for de-dupe.
      const book: Book = userId ? { ...base, id: crypto.randomUUID() } : base;

      set((state) => ({
        addedIds: [...state.addedIds, entry.id],
        books: [...state.books, book],
      }));

      if (userId) booksRepo.insertBook(book, userId).catch(reconcile);
      return true;
    },
  };
});
