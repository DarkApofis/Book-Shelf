'use client';

import { useState } from 'react';
import { cn } from '../lib/cn';

type CoverSize = 'sm' | 'md' | 'lg';

interface BookCoverProps {
  title: string;
  author?: string;
  /** Real cover image URL. Falls back to the typographic cover if absent or broken. */
  imageUrl?: string | null;
  /** `sm` list thumbnails, `md` shelf grid, `lg` detail hero — scales the fallback type. */
  size?: CoverSize;
  /** Width / extra utilities for this usage. Height follows the 2:3 aspect ratio. */
  className?: string;
}

const FALLBACK_TYPE: Record<CoverSize, { title: string; author: string; pad: string }> = {
  sm: { title: 'text-[8.5px]', author: 'text-[7px]', pad: 'px-1.5 py-1.5' },
  md: { title: 'text-[13px]', author: 'text-[10.5px]', pad: 'px-3 py-3' },
  lg: { title: 'text-[22px]', author: 'text-[13px]', pad: 'px-5 py-5' },
};

/**
 * The book cover used across shelves, detail and search. Renders the real image
 * when one is available; otherwise (or if it 404s — common with API books) a
 * quiet typographic cover keeps the grid's rhythm instead of a broken image.
 */
export function BookCover({ title, author, imageUrl, size = 'md', className }: BookCoverProps) {
  const [imageOk, setImageOk] = useState(true);
  const showImage = Boolean(imageUrl) && imageOk;
  const type = FALLBACK_TYPE[size];

  return (
    <div
      className={cn(
        'relative aspect-[2/3] overflow-hidden rounded-[3px] bg-line-soft',
        size === 'lg' ? 'shadow-cover-lg' : 'shadow-cover',
        className,
      )}
      aria-hidden="true"
    >
      {/* The typographic cover sits underneath: it shows while the image loads and stays if it fails. */}
      <div className={cn('flex h-full flex-col justify-between text-ink-soft', type.pad)}>
        <span className={cn('font-display font-semibold leading-[1.15]', type.title)}>{title}</span>
        {author && <span className={cn('text-muted', type.author)}>{author}</span>}
      </div>
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
    </div>
  );
}
