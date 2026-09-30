'use client';

import { cn } from '../lib/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — required since the content is only an icon glyph. */
  label: string;
  variant?: 'filled' | 'plain';
}

/** Icon-only button (close, dismiss, edit) with a 44px touch target. */
export function IconButton({ label, variant = 'filled', className, type = 'button', children, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'cursor-pointer leading-none',
        variant === 'filled'
          ? 'grid h-11 w-11 place-items-center rounded-lg border border-line bg-surface text-ink-soft hover:bg-sidebar'
          : 'grid h-11 w-11 place-items-center rounded-lg border-none bg-transparent text-muted hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
