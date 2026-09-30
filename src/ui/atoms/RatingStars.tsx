'use client';

const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z';

function starFill(n: number, rating: number): { fill: string; stroke: string } {
  if (n <= Math.floor(rating)) return { fill: 'var(--color-gold)', stroke: '#b8862a' };
  if (n - rating === 0.5) return { fill: '#ecd6a6', stroke: '#b8862a' };
  return { fill: 'transparent', stroke: '#b9c1bd' };
}

interface RatingStarsProps {
  rating: number;
  onRate: (rating: number) => void;
}

/** Five-star rating input. Clicking the current whole-star value clears it. */
export function RatingStars({ rating, onRate }: RatingStarsProps) {
  return (
    <div role="radiogroup" aria-label="Your rating" className="-ml-1.5 flex">
      {[1, 2, 3, 4, 5].map((n) => {
        const { fill, stroke } = starFill(n, rating);
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={Math.ceil(rating) === n}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onClick={() => onRate(rating === n ? 0 : n)}
            className="grid h-11 w-[34px] cursor-pointer place-items-center border-none bg-transparent p-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d={STAR} fill={fill} stroke={stroke} strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/** Compact read-only rating ("★ 4.5") for grids. Renders nothing when unrated. */
export function RatingBadge({ rating }: { rating: number }) {
  if (rating <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[12px] tabular-nums text-ink-soft" aria-label={`Rated ${rating} of 5`}>
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d={STAR} fill="var(--color-gold)" /></svg>
      {rating.toFixed(1)}
    </span>
  );
}
