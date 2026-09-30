'use client';

import { Icon, type IconName } from '../atoms/Icon';
import { cn } from '../lib/cn';

interface NavItemProps {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}

/** Sidebar navigation entry. The active page reads as a raised white tab. */
export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-[7px] border-none px-2.5 text-left text-[14px]',
        active
          ? 'bg-surface font-semibold text-ink shadow-[0_0_0_1px_var(--color-line),0_1px_2px_rgba(24,33,34,0.04)]'
          : 'bg-transparent font-medium text-ink-soft hover:bg-line-soft',
      )}
      onClick={onClick}
    >
      <span className={cn('flex', active ? 'text-accent' : 'text-muted')}><Icon name={icon} size={18} /></span>
      {label}
    </button>
  );
}
