/**
 * App-level constants that are demo fixtures rather than domain logic:
 * the simulated "today", the signed-in reader, and the reading goal. Kept in
 * one place so a real app can replace them with session/clock providers.
 */

/** Simulated current date for this demo (Tuesday, June 23, 2026). */
export const APP_TODAY = new Date(2026, 5, 23);

export const READER = {
  name: 'Maya',
  memberSince: 2023,
} as const;

export const READING_GOAL = {
  target: 36,
  /** Books finished so far in the current year. */
  read: 9,
} as const;

export const APP_BRAND = 'Folio';
