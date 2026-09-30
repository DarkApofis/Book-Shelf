'use client';

import { Icon } from '../atoms/Icon';
import { SrOnlyLabel } from '../atoms/SrOnlyLabel';

interface SearchFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function SearchField({ id, label, value, placeholder, onChange }: SearchFieldProps) {
  return (
    <div className="flex h-12 max-w-[720px] items-center gap-2.5 rounded-[9px] border border-line-strong bg-surface pl-3.5 pr-1.5 focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(63,106,91,0.14)]">
      <span className="flex text-muted"><Icon name="search" size={19} /></span>
      <SrOnlyLabel htmlFor={id}>{label}</SrOnlyLabel>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-none bg-transparent text-[16px] text-ink outline-none placeholder:text-faint"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="grid h-9 w-9 cursor-pointer place-items-center rounded-[7px] border-none bg-transparent text-muted hover:bg-line-soft"
        >
          <Icon name="close" size={17} />
        </button>
      )}
    </div>
  );
}
