'use client';

import { cn } from '../lib/cn';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Pill-shaped toggle used for shelf tabs and filters. */
export function Chip({ active = false, className, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'cursor-pointer rounded-[20px] border px-[13px] py-1.5 text-[13px]',
        active ? 'border-ink bg-ink font-semibold text-white' : 'border-line bg-surface font-medium text-muted',
        className,
      )}
      {...rest}
    />
  );
}
