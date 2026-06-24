'use client';

import { cn } from '../lib/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — required since the content is only an icon glyph. */
  label: string;
  variant?: 'filled' | 'plain';
}

/** Compact icon-only button (close, dismiss). */
export function IconButton({ label, variant = 'filled', className, type = 'button', children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'cursor-pointer leading-none',
        variant === 'filled'
          ? 'grid h-8 w-8 place-items-center rounded-full border-none bg-line-soft text-[17px] text-muted'
          : 'border-none bg-transparent text-[18px] text-faint',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
