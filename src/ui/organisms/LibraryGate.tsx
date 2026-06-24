'use client';

import { useAuthStore } from '../../store/useAuthStore';

const FEATURES = [
  { icon: '▤', title: 'Shelves', sub: 'Reading, want, finished' },
  { icon: '◷', title: 'Progress', sub: 'Pace & finish dates' },
  { icon: '✦', title: 'Year in Review', sub: 'Your reading, wrapped' },
];

/** Shown on the Library tab for guests, prompting sign-up. */
export function LibraryGate() {
  const goToAuth = useAuthStore((s) => s.goToAuth);

  return (
    <div className="mx-auto mt-[7vh] max-w-[560px] animate-[flUp_.4s_ease] text-center">
      <div className="mx-auto mb-[22px] grid h-[60px] w-[60px] place-items-center rounded-2xl bg-accent-soft text-[25px] text-accent">▣</div>
      <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-faint">Your library</div>
      <h1 className="my-2 mb-2.5 font-display text-[30px] font-extrabold tracking-[-0.02em]">Sign in to build your shelf</h1>
      <p className="mx-auto mb-[26px] max-w-[430px] text-[15px] leading-[1.55] text-muted">
        Save books, track every page, and pick up exactly where you left off — on any device. Your reading stays yours.
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button onClick={() => goToAuth('signup')} className="cursor-pointer rounded-[11px] border-none bg-accent px-[22px] py-3 text-[14.5px] font-bold text-white">Create your account</button>
        <button onClick={() => goToAuth('signin')} className="cursor-pointer rounded-[11px] border border-line-strong bg-surface px-[22px] py-3 text-[14.5px] font-semibold text-ink-soft">Sign in</button>
      </div>
      <div className="mx-auto mt-[38px] grid max-w-[480px] grid-cols-3 gap-[18px] text-left">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <div className="text-[18px] text-accent">{f.icon}</div>
            <div className="mt-[7px] text-[13px] font-semibold">{f.title}</div>
            <div className="mt-0.5 text-[12px] text-faint">{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
