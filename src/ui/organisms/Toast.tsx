'use client';

import { useUiStore } from '../../store/useUiStore';

/** Transient status message, driven by the UI store. */
export function Toast() {
  const message = useUiStore((s) => s.toast);
  if (!message) return null;

  return (
    <div
      className="fl-toast fixed bottom-[26px] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-[30px] bg-ink px-5 py-3 text-[13.5px] font-medium text-paper shadow-toast"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
