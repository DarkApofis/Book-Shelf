'use client';

import { useUiStore } from '../../store/useUiStore';

/** Transient status message, driven by the UI store. */
export function Toast() {
  const message = useUiStore((s) => s.toast);
  if (!message) return null;

  return (
    <div
      className="fl-toast fixed bottom-[88px] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-4 py-2.5 text-[13.5px] font-medium text-white shadow-toast nav:bottom-[26px]"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
