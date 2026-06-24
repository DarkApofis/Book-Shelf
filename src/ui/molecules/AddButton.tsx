'use client';

import { cn } from '../lib/cn';

interface AddButtonProps {
  added: boolean;
  onClick: () => void;
  className?: string;
}

/** Discover's add-to-shelf toggle, reflecting whether the book is already added. */
export function AddButton({ added, onClick, className }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-md border text-[12.5px] font-semibold',
        added ? 'border-accent-line bg-finished-soft text-accent' : 'border-line-strong bg-surface text-ink-soft',
        className,
      )}
    >
      {added ? '✓ Added' : '+ Add'}
    </button>
  );
}
