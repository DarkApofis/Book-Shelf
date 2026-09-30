'use client';

import { Icon } from '../atoms/Icon';
import { cn } from '../lib/cn';

interface AddToShelfButtonProps {
  title: string;
  added: boolean;
  onAdd: () => void;
  className?: string;
}

/** Discover's add action. Once added it becomes a quiet confirmation, not a button. */
export function AddToShelfButton({ title, added, onAdd, className }: AddToShelfButtonProps) {
  if (added) {
    return (
      <span className={cn('inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-semibold text-accent-ink', className)}>
        <Icon name="check" size={16} strokeWidth={2.2} />
        In your library
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add ${title} to Want to read`}
      className={cn(
        'inline-flex h-[42px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3.5 text-[13.5px] font-semibold text-ink hover:bg-sidebar',
        className,
      )}
    >
      <Icon name="plus" size={15} strokeWidth={2} />
      Want to read
    </button>
  );
}
