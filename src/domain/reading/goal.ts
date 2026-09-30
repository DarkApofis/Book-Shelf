/**
 * Annual reading-goal pace. Pure: "today" is injected so the result is
 * deterministic and testable.
 */

const MS_PER_DAY = 86_400_000;

export type GoalStanding = 'ahead' | 'on-track' | 'behind' | 'complete';

export interface GoalPace {
  /** Books a reader "should" have finished by today on an even pace. */
  expected: number;
  /** read − expected: positive = ahead, negative = behind. */
  delta: number;
  standing: GoalStanding;
  /** Books still to read to hit the target (never negative). */
  remaining: number;
  /** Books per month needed from today to finish on time (one decimal). */
  perMonthNeeded: number;
  /** Share of the year elapsed, 0..1 — where the "expected" marker sits. */
  yearElapsed: number;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.round((date.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

function daysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

/**
 * Compare progress against an even pace through the year. "On track" allows a
 * one-book tolerance either way so the label doesn't flicker day to day.
 */
export function goalPace(read: number, target: number, today: Date): GoalPace {
  const totalDays = daysInYear(today.getFullYear());
  const elapsedDays = dayOfYear(today);
  const yearElapsed = Math.min(1, elapsedDays / totalDays);
  const expected = Math.round(target * yearElapsed);
  const delta = read - expected;
  const remaining = Math.max(0, target - read);

  const monthsLeft = ((totalDays - elapsedDays) / totalDays) * 12;
  const perMonthNeeded = remaining === 0 ? 0 : Math.round((remaining / Math.max(monthsLeft, 1 / 30)) * 10) / 10;

  let standing: GoalStanding;
  if (read >= target) standing = 'complete';
  else if (delta > 1) standing = 'ahead';
  else if (delta < -1) standing = 'behind';
  else standing = 'on-track';

  return { expected, delta, standing, remaining, perMonthNeeded, yearElapsed };
}
