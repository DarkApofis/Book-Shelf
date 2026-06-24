'use client';

import { useState } from 'react';
import { cn } from '../lib/cn';

interface BookCoverProps {
  /** Per-book cover color — this is data, so it remains an inline style. */
  color: string;
  /** Real cover image URL. Falls back to the typographic cover if absent or broken. */
  imageUrl?: string | null;
  /** Sizing / radius / shadow / padding utilities for this usage. */
  className?: string;
  /** Optional reading-progress overlay along the bottom edge. */
  progressPct?: number;
  children?: React.ReactNode;
}

/**
 * The book cover used across shelves, drawers and search. Renders a real image
 * when one is available, layered over a colored typographic cover that shows
 * through while the image loads and stays put if it 404s (≈20-30% of API books).
 */
export function BookCover({ color, imageUrl, className, progressPct, children }: BookCoverProps) {
  const [imageOk, setImageOk] = useState(true);
  const showImage = Boolean(imageUrl) && imageOk;

  return (
    <div
      className={cn('relative flex flex-col overflow-hidden text-white', className)}
      style={{ background: color }}
      aria-hidden={children ? undefined : true}
    >
      {children}
      {showImage && (
        // Third-party cover that may be missing — plain img keeps the onError fallback
        // simple and avoids proxying every external cover through the Next optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl as string}
          alt=""
          loading="lazy"
          onError={() => setImageOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {progressPct !== undefined && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
          <div className="h-full bg-white" style={{ width: `${progressPct}%` }} />
        </div>
      )}
    </div>
  );
}
