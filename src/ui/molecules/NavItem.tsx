'use client';

import { cn } from '../lib/cn';

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      className={cn(
        'fl-nav flex w-full cursor-pointer items-center gap-[11px] rounded-[10px] border-none px-3 py-2.5 text-left text-[14.5px]',
        active ? 'bg-accent-soft font-semibold text-ink' : 'bg-transparent font-medium text-muted',
      )}
      onClick={onClick}
    >
      <span className="inline-flex w-[18px]" aria-hidden="true">{icon}</span>
      <span className="fl-navlabel">{label}</span>
    </button>
  );
}
