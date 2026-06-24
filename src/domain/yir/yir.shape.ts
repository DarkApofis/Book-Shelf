/**
 * Year-in-Review shaping: turns raw stored figures (`YirBaseData`) into a
 * fully computed, presentation-ready `YirShape`. Pure — all charts, bars,
 * percentages and the in-progress projection are derived here, not in the view.
 */
import { formatThousands, MONTHS_FULL, MONTHS_SHORT, parseDateLabel } from '../shared/format';
import type { Book } from '../book/book.types';
import type {
  GenreStat, MonthBar, RatingBar, StatRecord,
  YirBaseData, YirDataStore, YirScenario, YirShape, YirYear,
} from './yir.types';

/** Chart series palette for the genre bars (data-viz only). */
const GENRE_COLORS = ['#9fd1bb', '#7fb0d6', '#d6a96a', '#b29bc4', '#6fc0bd', '#a8bd86'];

/** How far into the in-progress year we are (June -> 6 months elapsed). */
const DEFAULT_ELAPSED_MONTHS = 6;

interface ShapeInput extends YirBaseData {
  eyebrow: string;
  inProgress: boolean;
  projNote?: string;
  shareYear: string;
}

function shape(d: ShapeInput): YirShape {
  const maxMonth = Math.max(...d.monthly, 1);
  const monthly: MonthBar[] = d.monthly.map((count, i) => ({
    label: MONTHS_SHORT[i],
    count,
    h: count ? Math.max(7, Math.round((count / maxMonth) * 100)) : 3,
    fill: count
      ? count === maxMonth ? '#9fd1bb' : 'rgba(159,209,187,.55)'
      : 'rgba(255,255,255,.08)',
  }));

  // With no monthly activity at all (real data with no logged dates), there is no
  // "busiest" month — fall back to a dash rather than pointing at a phantom January.
  const hasMonthData = d.monthly.some((c) => c > 0);
  const topIdx = hasMonthData ? d.monthly.indexOf(maxMonth) : -1;
  const topMonthLabel = hasMonthData ? MONTHS_FULL[topIdx] : '—';
  const genreTotal = d.genres.reduce((sum, [, n]) => sum + n, 0) || 1;
  const genres: GenreStat[] = d.genres.map(([name, count], i) => ({
    name,
    count,
    pct: Math.round((count / genreTotal) * 100),
    color: GENRE_COLORS[i % GENRE_COLORS.length],
  }));

  const maxRating = Math.max(...d.ratingDist.map(([, n]) => n), 1);
  const ratingDist: RatingBar[] = d.ratingDist.map(([label, n]) => ({
    label,
    pct: Math.round((n / maxRating) * 100),
  }));

  const records: StatRecord[] = [
    { label: 'Longest book', value: `${formatThousands(d.longest[1])}p`, sub: d.longest[0] },
    { label: 'Shortest book', value: `${d.shortest[1]}p`, sub: d.shortest[0] },
    { label: 'Longest streak', value: `${d.streak} days`, sub: 'reading in a row' },
    { label: 'Authors', value: d.authors, sub: 'distinct voices' },
    { label: 'Most-read', value: d.topAuthor, sub: `${d.topAuthorN} books` },
    { label: 'Busiest month', value: topMonthLabel, sub: hasMonthData ? `${maxMonth} books` : 'no logged dates' },
  ];

  return {
    books: d.books, pages: d.pages, avgRating: d.avgRating,
    monthly, genres, ratingDist,
    fave: d.fave, records,
    topMonth: topMonthLabel, pagesStr: formatThousands(d.pages),
    topGenre: genres[0]?.name ?? '—',
    eyebrow: d.eyebrow, headline: d.headline, pagesNote: d.pagesNote,
    inProgress: d.inProgress, projNote: d.projNote, shareYear: d.shareYear,
    streak: d.streak, authors: d.authors, topAuthor: d.topAuthor, topAuthorN: d.topAuthorN,
  };
}

export interface BuildYirConfig {
  /** Months elapsed in the in-progress (2026) year. */
  elapsedMonths?: number;
}

/**
 * Build the Year-in-Review for a scenario and year. For the in-progress year
 * (2026) figures are pro-rated from the full-year baseline by the share of the
 * year that has elapsed, and a projection note is added.
 */
export function buildYir(
  store: YirDataStore,
  scenario: YirScenario,
  year: YirYear,
  config: BuildYirConfig = {},
): YirShape {
  const base = store[scenario];

  if (year === 2026) {
    const elapsed = config.elapsedMonths ?? DEFAULT_ELAPSED_MONTHS;
    const monthsSoFar = base.monthly.slice(0, elapsed);
    const books = monthsSoFar.reduce((sum, c) => sum + c, 0);
    const ratio = base.books ? books / base.books : 0;
    const pages = Math.round(base.pages * ratio);
    const monthly = [...monthsSoFar, ...Array(12 - elapsed).fill(0)];
    const genres = base.genres
      .map(([name, count]) => [name, Math.max(0, Math.round(count * ratio))] as [string, number])
      .filter(([, count]) => count > 0);

    return shape({
      ...base,
      books, pages, monthly, genres,
      streak: Math.round(base.streak * ratio),
      authors: Math.max(1, Math.round(base.authors * ratio)),
      eyebrow: '2026 · SO FAR',
      headline: "You're six months in and already building something good.",
      inProgress: true,
      projNote: `On pace for ~${Math.round((books / elapsed) * 12)} books this year`,
      pagesNote: `${formatThousands(pages)} pages so far — and counting.`,
      shareYear: '2026 · so far',
    });
  }

  return shape({ ...base, eyebrow: '2025 · WRAPPED', inProgress: false, shareYear: '2025' });
}

/* ------------------------------------------------------------------ *
 * Live Year-in-Review — computed from the reader's real library.      *
 * ------------------------------------------------------------------ */

/** "Kazuo Ishiguro" -> "K. Ishiguro" (matches the design's compact author style). */
function abbreviateAuthor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
}

/** A short, honest note for the favorite book based on its shape. */
function faveNote(book: Book): string {
  if (book.pages >= 600) return `${book.pages} pages — and you closed it wishing there were more.`;
  if (book.rating >= 5) return 'A five-star read you kept thinking about after the last page.';
  if (book.rating >= 4.5) return 'One of the ones that stuck with you this year.';
  return 'Your highest-rated read so far.';
}

/** The month a book was most recently active: its latest session, else its start. */
function bookMonth(book: Book, year: number): number | null {
  const label = book.sessions?.[0]?.date ?? book.started;
  if (!label) return null;
  return parseDateLabel(label, year).getMonth();
}

/** Longest run of consecutive calendar days across all logged reading sessions. */
function longestStreak(books: Book[], year: number): number {
  const days = new Set<number>();
  for (const b of books) {
    for (const s of b.sessions ?? []) {
      const d = parseDateLabel(s.date, year);
      days.add(Math.floor(d.getTime() / 86_400_000));
    }
  }
  if (days.size === 0) return 0;
  const sorted = [...days].sort((a, b) => a - b);
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    run = sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

/**
 * Build a Year-in-Review from the reader's actual books. Headline figures come
 * from *finished* books; the rhythm chart and streak come from logged reading
 * activity across all shelves. Returns `null` when nothing has been finished yet
 * (the view shows a "still being written" state instead of a wall of zeros).
 */
export function buildLiveYir(
  books: Book[],
  year: number,
  config: BuildYirConfig = {},
): YirShape | null {
  const finished = books.filter((b) => b.status === 'finished');
  if (finished.length === 0) return null;

  const reading = books.filter((b) => b.status === 'reading');
  const rated = finished.filter((b) => b.rating > 0);

  // Pages turned = every finished book in full + the pages reached in open books.
  const pages = finished.reduce((sum, b) => sum + b.pages, 0)
    + reading.reduce((sum, b) => sum + b.page, 0);

  const avg = rated.length
    ? (rated.reduce((sum, b) => sum + b.rating, 0) / rated.length)
    : 0;

  // Genres — finished books grouped, biggest first, capped at the six bars shown.
  const genreCounts = new Map<string, number>();
  for (const b of finished) genreCounts.set(b.genre, (genreCounts.get(b.genre) ?? 0) + 1);
  const genres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6) as [string, number][];

  // Rating distribution, 5★ down to 1★ (half-stars round to the nearest).
  const ratingDist: [string, number][] = ['5', '4', '3', '2', '1'].map((label) => [
    label,
    rated.filter((b) => Math.round(b.rating) === Number(label)).length,
  ]);

  // Monthly rhythm — count each engaged book under its most recent activity month.
  const monthly = Array(12).fill(0);
  for (const b of [...finished, ...reading]) {
    const m = bookMonth(b, year);
    if (m !== null) monthly[m] += 1;
  }

  const byPages = [...finished].sort((a, b) => b.pages - a.pages);
  const longest = byPages[0];
  const shortest = byPages[byPages.length - 1];

  const fave = [...rated].sort((a, b) => b.rating - a.rating || b.pages - a.pages)[0] ?? finished[0];

  const authorCounts = new Map<string, number>();
  for (const b of finished) authorCounts.set(b.author, (authorCounts.get(b.author) ?? 0) + 1);
  const [topAuthorName, topAuthorN] = [...authorCounts.entries()]
    .sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];

  const elapsed = config.elapsedMonths ?? DEFAULT_ELAPSED_MONTHS;
  const perDay = Math.max(1, Math.round(pages / (elapsed * 30)));
  const n = finished.length;

  return shape({
    books: n,
    pages,
    avgRating: rated.length ? avg.toFixed(1) : '—',
    monthly,
    genres,
    ratingDist,
    fave: { title: fave.title, author: fave.author, cover: fave.cover, note: faveNote(fave) },
    longest: [longest.title, longest.pages],
    shortest: [shortest.title, shortest.pages],
    streak: longestStreak(books, year),
    authors: authorCounts.size,
    topAuthor: abbreviateAuthor(topAuthorName),
    topAuthorN,
    headline: n === 1
      ? 'One book down — your reading year has officially begun.'
      : `${n} books and ${formatThousands(pages)} pages — your year in reading, as it happens.`,
    pagesNote: `That's about ${perDay} ${perDay === 1 ? 'page' : 'pages'} a day across the year so far.`,
    eyebrow: `${year} · YOUR YEAR SO FAR`,
    inProgress: true,
    projNote: `On pace for ~${Math.max(n, Math.round((n / elapsed) * 12))} books this year`,
    shareYear: `${year} · so far`,
  });
}
