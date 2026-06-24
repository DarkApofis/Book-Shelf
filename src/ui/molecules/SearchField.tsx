'use client';

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
    <div className="relative max-w-[560px]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-faint" aria-hidden="true">⌕</span>
      <SrOnlyLabel htmlFor={id}>{label}</SrOnlyLabel>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line-strong bg-surface py-[14px] pl-[42px] pr-4 text-[15px] text-ink outline-none"
      />
    </div>
  );
}
