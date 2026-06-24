/** Year-in-Review domain types: raw stored data vs. view-shaped output. */

export type YirScenario = 'you' | 'light' | 'avid';
export type YirYear = 2025 | 2026;

/** Raw, stored figures for one reader scenario for a full year. */
export interface YirBaseData {
  books: number;
  pages: number;
  avgRating: string;
  monthly: number[];
  genres: [string, number][];
  ratingDist: [string, number][];
  fave: YirFavorite;
  longest: [string, number];
  shortest: [string, number];
  streak: number;
  authors: number;
  topAuthor: string;
  topAuthorN: number;
  headline: string;
  pagesNote: string;
}

export interface YirFavorite {
  title: string;
  author: string;
  cover: string;
  note: string;
}

export type YirDataStore = Record<YirScenario, YirBaseData>;

/* ---- Shaped (view-ready) types ---- */

export interface MonthBar { label: string; count: number; h: number; fill: string }
export interface GenreStat { name: string; count: number; pct: number; color: string }
export interface RatingBar { label: string; pct: number }
export interface StatRecord { label: string; value: string | number; sub: string }

/** Fully computed, presentation-ready Year-in-Review payload. */
export interface YirShape {
  books: number;
  pages: number;
  avgRating: string;
  monthly: MonthBar[];
  genres: GenreStat[];
  ratingDist: RatingBar[];
  fave: YirFavorite;
  records: StatRecord[];
  topMonth: string;
  pagesStr: string;
  topGenre: string;
  eyebrow: string;
  headline: string;
  pagesNote: string;
  inProgress: boolean;
  projNote?: string;
  shareYear: string;
  streak: number;
  authors: number;
  topAuthor: string;
  topAuthorN: number;
}
