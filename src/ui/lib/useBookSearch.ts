'use client';

import { useEffect, useState } from 'react';
import type { CatalogBook } from '../../domain/book/book.types';
import { searchBooks } from '../../data/bookSearch';

export interface BookSearchState {
  results: CatalogBook[];
  loading: boolean;
  error: boolean;
}

/**
 * Debounced book search against the BFF. Cancels the in-flight request when the
 * query changes (or the component unmounts) so stale results never land.
 */
export function useBookSearch(query: string, debounceMs = 350): BookSearchState {
  const [state, setState] = useState<BookSearchState>({ results: [], loading: false, error: false });

  useEffect(() => {
    const q = query.trim();
    // Nothing to search; consumers hide results when the query is empty, so the
    // (now stale) state stays out of view until the next query — no churn needed.
    if (!q) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, loading: true, error: false }));
      searchBooks(q, controller.signal)
        .then((results) => setState({ results, loading: false, error: false }))
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          setState({ results: [], loading: false, error: true });
        });
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs]);

  return state;
}
