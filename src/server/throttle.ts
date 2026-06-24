/**
 * Rate-limits async task *starts* to at most one per `minIntervalMs`. Open
 * Library asks for ~1 request/second sustained — a rate, not a concurrency
 * limit. We reserve each task's start slot ≥1s after the previous one, but let
 * the tasks themselves run concurrently, so a fresh search only waits for its
 * own slot — never for an earlier, still-in-flight (and slow) Open Library call.
 *
 * On serverless this is per-instance: bursts within one warm instance stay
 * polite, and the typical low-traffic case sees no added delay.
 */
export function createThrottle(minIntervalMs: number) {
  let nextStart = 0;

  return async function run<T>(task: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const start = Math.max(now, nextStart);
    nextStart = start + minIntervalMs;
    const wait = start - now;
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    return task();
  };
}
